#for single build
#the image of alpine os that has node installed
#make sure that the node version is compatible with your project version
FROM node:14-alpine

#working directory for docker to create image into
WORKDIR /app
#first dot is working directory where you are currently the second dot is destination directory like /app
COPY . .

RUN yarn

RUN yarn tsc

#expose port 3000
EXPOSE 3000

CMD ["yarn","start"]
