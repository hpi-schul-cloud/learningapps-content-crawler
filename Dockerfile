FROM node:8.7.0

RUN npm install -g nodemon

# Install dependency outside of the app volume
COPY package.json package-lock.json /opt/
COPY local_modules /opt/local_modules
RUN cd /opt && npm install
ENV NODE_PATH=/opt/node_modules

# Copy current directory to container
COPY . /home/node/app

USER node
WORKDIR /home/node/app

EXPOSE 5000
CMD ["node", "bin/www"]