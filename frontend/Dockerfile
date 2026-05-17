# Use official Node image
FROM node:20-slim

# Set work directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy project
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
