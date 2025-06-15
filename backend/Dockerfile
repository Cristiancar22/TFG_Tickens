# Imagen base
FROM node:20

# Directorio de trabajo
WORKDIR /app

# Copiar solo package.json y package-lock.json
COPY package*.json ./

# Instalar TODAS las dependencias (incluidas devDependencies)
ENV NODE_ENV=development
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Comando por defecto
CMD ["npx", "nodemon", "server.ts"]
