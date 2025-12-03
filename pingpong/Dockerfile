FROM node:alpine

WORKDIR /pingpong

COPY package* ./

RUN npm ci

COPY . .

CMD ["npm", "start"]