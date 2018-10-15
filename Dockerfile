FROM node:10.11.0

# Create app directory
WORKDIR /usr/src/app

COPY . .

EXPOSE 8080
CMD [ "npm", "run", "start-loop"]