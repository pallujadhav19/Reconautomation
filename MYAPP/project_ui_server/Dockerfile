# Step 1: Use official Node.js image
FROM node:20-alpine

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Step 4: Copy the rest of the backend code
COPY . .

# Step 5: Expose the backend port
EXPOSE 8080

# Step 6: Start the backend server
CMD ["node", "server.js"]
