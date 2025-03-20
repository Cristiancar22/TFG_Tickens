# Usa una imagen oficial de Node como base
FROM node:18-alpine

# Define el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el package.json y package-lock.json antes de instalar dependencias
COPY package.json package-lock.json ./

# Instala dependencias
RUN npm install

# Copia el resto de los archivos
COPY . .

# Expone el puerto en el que corre el backend
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start"]
