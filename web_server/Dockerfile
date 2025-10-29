FROM node:alpine

WORKDIR /web_server 

COPY package* ./

RUN npm ci

COPY . .

CMD ["npm", "start"]