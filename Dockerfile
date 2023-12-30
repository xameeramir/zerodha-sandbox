# Use a Node.js base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

COPY package.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory in the container
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["node", "./transpiled-build/index.js"]