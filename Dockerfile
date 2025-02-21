# Installed Docker Extension onto VSCode
# Created Dockerfile

FROM node:16.5.0

WORKDIR /app

# Firt copy package.json and package-lock.json
COPY package*.json ./

# Then run npm install
RUN npm install

# Copy the rest of the files to local working directory
# This creates a problem due to node_modules being copied, so we need to add .dockerignore file
COPY . . 

# Build the application
RUN npm run build-static

ENV PORT=8080

EXPOSE 8080

# Command to run the Magic Mirror app
CMD [ "npm", "start" ]