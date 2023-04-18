# Set the base image to Node.js
FROM node:19

# Set the working directory in the container
WORKDIR src/app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the app source code to the working directory
COPY . .

# Expose the port your app will run on
EXPOSE 3001

# Set the command to run your app
CMD [ "npx", "nodemon", "server.js" ]

