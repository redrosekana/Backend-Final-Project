ARG NODE_VERSION=18.16.0

FROM node:${NODE_VERSION}-alpine
WORKDIR /usr/src/app

COPY package*.json .
RUN npm install
COPY . .

RUN npm install -g typescript
RUN tsc

EXPOSE 5000
CMD [ "npm", "run", "start:docker" ]



