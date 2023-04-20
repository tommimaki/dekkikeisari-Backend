# Setting the base image to Node.js
FROM node:19
# Setting the working directory in the container
WORKDIR src/app
# Copyying package.json and package-lock.json files to the working directory
COPY package*.json ./
# Installing app dependencies
RUN npm install
# Copying the app source code to the working directory
COPY . .
# Exposing the port the app will run on
EXPOSE 3001
# Setting the command to run app
CMD [ "npx", "nodemon", "server.js" ]