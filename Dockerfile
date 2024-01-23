FROM node:lts
WORKDIR /usr/src/app

COPY package*.json .
RUN npm install
COPY . .

RUN npm install -g typescript
RUN tsc

EXPOSE 5000
CMD [ "npm", "run", "prod" ]