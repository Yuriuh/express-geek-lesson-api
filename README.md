# 极客课堂API

## Project setup

```
npm install or yarn install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Run MongoDB by Docker

```
docker run -itd --name mongo -p 27017:27017 mongo
```

### Config env file

```
// config/config.env
NODE_ENV=development
PORT=5000

NET_MONGO_URI=mongodb://url
LOC_MONGO_URI=mongodb://127.0.0.1:27017/

JWT_SECRET=youareawesome
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

SMTP_NAME=xxx
SMTP_EMAIL=xxx
SMTP_PASSWORD=xxx
```

### Seed MongoDB Data

```
node seeder.js -i
```

### Delete MongoDB Data

```
node seeder.js -d
```
