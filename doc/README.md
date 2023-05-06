# Doc

In order to host the app with docker-compose create `.env` file in `/client`, copy example deployment file to project root directory and run command: 

```bash
docker-compose up --build
```

## Example `.env`

### backend

- CLIENT_URL
- MONGO_HOST
- MONGO_PORT
- MONGO_DATABASE
- MONGO_USER
- MONGO_PASSWORD
- ACCESS_TOKEN_SECRET
- REFRESH_TOKEN_SECRET

### client

- REACT_APP_API_URL
- REACT_APP_SOCKET_URL