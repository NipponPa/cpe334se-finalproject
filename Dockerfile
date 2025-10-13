# Use an official Node.js runtime as a parent image
# Using node:20-alpine for a lightweight image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker layer caching
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Expose port 3000 to allow communication to/from server
EXPOSE 3000

# Command to run the app
CMD ["npm", "run", "dev"]