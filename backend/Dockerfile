FROM node:18-alpine as base

FROM base as builder

COPY . .

RUN npm ci

RUN npm run build

FROM base as runner

ENV NODE_ENV production

COPY package.json package-lock.json ./

COPY --from=builder ./dist ./dist

RUN npm ci

EXPOSE 5000

CMD ["npm", "run", "start"]
