# node base image is used to build the frontend application
FROM node:18-alpine AS build

WORKDIR /app

# Copy all the dependencies
COPY package*.json ./

# install the dependencies
RUN npm install

# copy all the remaining code
COPY . .

# Build the frontend application for production
RUN npm run build

CMD ["npm", "run", "start"]

