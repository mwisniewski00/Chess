FROM node:16-alpine AS builder
WORKDIR /api
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine AS service
WORKDIR /api
COPY package* ./
RUN npm install --omit=dev
COPY --from=builder ./api/build ./build
EXPOSE 5000
CMD ["npm", "start"]