FROM node:22

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the startup script
COPY startup.sh /app/startup.sh
RUN chmod +x /app/startup.sh

# Expose the application port
EXPOSE 3000

# Run the startup script
CMD ["./startup.sh"]