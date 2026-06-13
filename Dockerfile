# 1. Use the official Node.js image
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /app


COPY package*.json ./
RUN npm install --production

# 4. Copy the rest of your application code
COPY . .

# 5. Start the application
CMD ["node", "server.js"] 
