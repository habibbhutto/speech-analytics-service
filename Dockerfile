FROM node:18.16.1-alpine3.18

WORKDIR /app

RUN npm install --global pnpm

# Allow for Docker caching of node modules
COPY package.json /app/package.json

# if speech analysis would need to install custom packages one day
# COPY .npmrc /app/.npmrc

RUN pnpm install

# Copy the rest of the application
COPY . /app

RUN pnpm build

# CMD ["pnpm", "run", "start"]
