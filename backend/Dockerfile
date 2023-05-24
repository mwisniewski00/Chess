# builder stage
FROM node:18-alpine AS builder
WORKDIR /api
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM node:18-alpine AS service
WORKDIR /api
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder ./api/build ./build
EXPOSE 5000
COPY start.sh start.sh
CMD ["sh", "./start.sh"]