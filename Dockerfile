#########################
### build environment ###
#########################

FROM node:16.13.1 as builder

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package-lock.json package.json ./
RUN npm ci

COPY . .

# SSR build: browser bundle + server bundle
RUN npm run build

##################
### production ###
##################

FROM node:16.13.1-slim

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./

EXPOSE 4000

CMD ["node", "dist/career-portal/server/main.js"]
