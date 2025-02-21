# Installed Docker Extension onto VSCode
# Created Dockerfile

FROM node:23.6.1-alpine3.13

WORKDIR /app

# Firt copy package.json and package-lock.json
COPY package*.json ./

# Then run npm install
RUN npm install

# Copy the rest of the files to local working directory
# This creates a problem due to node_modules being copied, so we need to add .dockerignore file
COPY . . 

ENV PORT=8080

EXPOSE 8080

# Command to run the Magic Mirror app
CMD [ "npm", "start" ]