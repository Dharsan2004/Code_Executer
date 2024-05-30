FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Ensure Python is installed for running Python scripts
RUN apt-get update && apt-get install -y python3

EXPOSE 8000
CMD [ "node", "server.js" ]

#docker build -t code_executer_time .
#docker run -it -p 8000:8000 code_executer