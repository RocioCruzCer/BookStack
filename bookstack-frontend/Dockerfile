FROM node:20-alpine

WORKDIR /app

# Copiamos los archivos de configuración
COPY package*.json ./

# EL CAMBIO ESTÁ AQUÍ: Borramos el lockfile de Windows antes de instalar
RUN rm -f package-lock.json && npm install

# Copiamos todo el código fuente
COPY . .

# Exponemos el puerto de Vite
EXPOSE 5173

# Arrancamos en modo desarrollo
CMD ["npm", "run", "dev", "--", "--host"]