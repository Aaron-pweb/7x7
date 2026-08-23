FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies (only package files to leverage cache)
COPY package.json package-lock.json ./
RUN npm install

# We don't copy the rest of the files because we will use a bind mount
# in docker-compose.yml for hot reloading during development.

EXPOSE 3000

# The startup command will push the db schema and start the dev server
CMD ["sh", "-c", "npx prisma db push && npm run dev"]
