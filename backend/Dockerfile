FROM node:20

WORKDIR /app

# Solo copiamos package.json para instalar dependencias
COPY package*.json ./

RUN npm install

# Copiamos el resto del código
COPY . .

# Instalamos nodemon globalmente por comodidad
RUN npm install -g nodemon

CMD ["npm", "run", "dev"]
