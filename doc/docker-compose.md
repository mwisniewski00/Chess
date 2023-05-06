# Example docker-compose

```yaml
version: '3'

services:
  client:
      build: './client'
      depends_on:
        - backend
      environment:
        REACT_APP_API_URL: 'http://nginx/api'
        REACT_APP_SOCKET_URL: 'http://nginx/api'
  
  backend:
    build: './backend'
    environment:
      ACCESS_TOKEN_SECRET: ''
      REFRESH_TOKEN_SECRET: ''
      MONGO_HOST: '' 
      MONGO_PORT:  
      MONGO_DATABASE: ''
      MONGO_USER: ''
      MONGO_PASSWORD: ''
      CLIENT_URL: 'http://nginx'
      PORT: ''
  
  nginx:
    image: nginx:latest
    ports:
      - '85:80'
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - client
      - backend
```
