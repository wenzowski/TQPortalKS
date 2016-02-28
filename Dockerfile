FROM mhart/alpine-node:0.10

WORKDIR /app
ADD . .

RUN npm i

EXPOSE 3000
CMD ["node", "app.js"]
