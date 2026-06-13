# 1. Use the official Node.js image
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /app


COPY package*.json ./
RUN npm install --production

# 4. Copy the rest of your application code
COPY . .

# Add this line (most apps use 8080 or 3000)
EXPOSE 5000

# 5. Start the application
CMD ["node", "server.js"] 
