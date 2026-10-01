FROM node:20-alpine
WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --chown=1001:0 server.js ./

# OpenShift runs containers with a random user ID, so never rely on root
USER 1001
EXPOSE 8080
CMD ["node", "server.js"]
