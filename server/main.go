package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

var (
	rdb *redis.Client
)

func init() {
	if os.Getenv("GO_ENV") != "production" {
		if err := godotenv.Load("../.env"); err != nil {
			log.Println("Warning: .env file not found")
		}
	}

	redisHost := os.Getenv("REDIS_HOST")
	redisPort := os.Getenv("REDIS_PORT")
	redisPassword := os.Getenv("REDIS_PASSWORD")
	redisDB := 0

	if db, err := strconv.Atoi(os.Getenv("REDIS_DB")); err == nil {
		redisDB = db
	}

	rdb = redis.NewClient(&redis.Options{
		Addr:     redisHost + ":" + redisPort, 
		Password: redisPassword,               
		DB:       redisDB,                     
	})
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") // Allow all origins
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			return
		}
		next.ServeHTTP(w, r)
	})
}

func getLocation(w http.ResponseWriter, r *http.Request) {	
	resp, err := http.Get("https://ipinfo.io/json?token=" + os.Getenv("IP_INFO_API"))
	if err != nil {
		http.Error(w, "Failed to get location", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	var locationData map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&locationData); err != nil {
		http.Error(w, "Failed to parse location data", http.StatusInternalServerError)
		return
	}

	city := locationData["city"].(string) 
	region := locationData["region"].(string)
	postal := locationData["postal"].(string)

	// Check if we have cached data for the city
	cachedData, err := rdb.Get(context.Background(), "city:"+city).Result()
	if err == nil {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(cachedData))
		return
	}

	weatherAPIKey := os.Getenv("ACCUWEATHER_API")
	weatherResp, err := http.Get(fmt.Sprintf("http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=%s&q=%s", weatherAPIKey, postal))
	if err != nil {
		http.Error(w, "Failed to fetch weather data", http.StatusInternalServerError)
		return
	}
	defer weatherResp.Body.Close()

	var locationCodeData []map[string]interface{}
	if err := json.NewDecoder(weatherResp.Body).Decode(&locationCodeData); err != nil {
		http.Error(w, "Failed to parse location code data", http.StatusInternalServerError)
		return
	}

	// Extract location key from response
	// locationKey := locationCodeData[0]["Key"].(string)
	if len(locationCodeData) == 0 {
		log.Println("No location code found for postal:", postal)
		http.Error(w, "No location code found", http.StatusInternalServerError)
		return
	}
	
	key, ok := locationCodeData[0]["Key"].(string)
	if !ok {
		log.Println("Key not found or not a string in locationCodeData")
		http.Error(w, "Invalid location key", http.StatusInternalServerError)
		return
	}
	
	locationKey := key

	// Fetch the weather forecast and current weather
	forecastResp, err := http.Get(fmt.Sprintf("http://dataservice.accuweather.com/forecasts/v1/daily/5day/%s?apikey=%s", locationKey, weatherAPIKey))
	if err != nil {
		http.Error(w, "Failed to fetch forecast data", http.StatusInternalServerError)
		return
	}
	defer forecastResp.Body.Close()

	var weatherForecastData map[string]interface{}
	if err := json.NewDecoder(forecastResp.Body).Decode(&weatherForecastData); err != nil {
		http.Error(w, "Failed to parse weather forecast", http.StatusInternalServerError)
		return
	}

	currentWeatherResp, err := http.Get(fmt.Sprintf("http://dataservice.accuweather.com/currentconditions/v1/%s?apikey=%s&details=true", locationKey, weatherAPIKey))
	if err != nil {
		http.Error(w, "Failed to fetch current weather", http.StatusInternalServerError)
		return
	}
	defer currentWeatherResp.Body.Close()

	var currentWeatherData []map[string]interface{}
	if err := json.NewDecoder(currentWeatherResp.Body).Decode(&currentWeatherData); err != nil {
		http.Error(w, "Failed to parse current weather", http.StatusInternalServerError)
		return
	}

	// Construct the response data
	responseData := map[string]interface{}{
		"city":            city,
		"region":          region,
		"weatherForecast": weatherForecastData,
		"currentWeather":  currentWeatherData,
	}

	// Cache the data for 1 hour
	cacheData, err := json.Marshal(responseData)
	if err == nil {
		rdb.SetEX(context.Background(), "city:"+city, cacheData, time.Hour)
	}

	// Send the response
	w.Header().Set("Content-Type", "application/json")
	w.Write(cacheData)
}

func clearAudio(w http.ResponseWriter, r *http.Request) {
	audioFile := "./client/src/assets/speech.mp3"
	err := os.WriteFile(audioFile, []byte(""), 0644)
	if err != nil {
		http.Error(w, "Failed to clear audio file", http.StatusInternalServerError)
		return
	}

	// Respond with success message
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Audio file cleared"}`))
}

func main() {
	router := mux.NewRouter()

	// API routes
	router.HandleFunc("/location", getLocation).Methods("GET")
	router.HandleFunc("/clear-audio", clearAudio).Methods("POST")

	// Serve static files from the React build directory
	staticDir := "../client/dist"
	router.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir(staticDir))))

	// Catch-all route to serve React's index.html for non-API routes
	router.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" || r.URL.Path == "/index.html" {
			http.ServeFile(w, r, staticDir+"/index.html")
		} else {
			http.NotFound(w, r)
		}
	})

	port := os.Getenv("GO_PORT")
	if port == "" {
		port = "3006" 
	}

	log.Printf("Server started on :%s\n", port)
	if err := http.ListenAndServe(":"+port, enableCORS(router)); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}