# Blog API

API desarrollada con **Node**, **TypeScript**, **Express**, **JWT** y **MongoDB**.

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto y copia las siguientes variables:

```env
PORT=7000
NODE_ENV=development

MONGO_URI=mongodb://root:root@localhost:27017

LOG_LEVEL=info

JWT_ACCESS_SECRET=beM5R85zRlL3
JWT_REFRESH_SECRET=8JEP68yph8tV
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=1w
