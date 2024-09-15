# Step 1: Use an official Node.js runtime as the base image
FROM node:18

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy the rest of the backend files
COPY . .

# Step 5: Expose the backend port (4000)
EXPOSE 4000

# Step 6: Start the backend
CMD ["npm", "start"]
