FROM refinedev/node:18 AS base

ARG VITE_API_URL
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_AUDIENCE
ARG VITE_AUTH0_CLIENTID

FROM base as deps

COPY package.json package-lock.json* ./

RUN npm ci

FROM base as builder

ENV NODE_ENV production
ENV VITE_API_URL ${VITE_API_URL}
ENV VITE_AUTH0_DOMAIN ${VITE_AUTH0_DOMAIN}
ENV VITE_AUTH0_AUDIENCE ${VITE_AUTH0_AUDIENCE}
ENV VITE_AUTH0_CLIENTID ${VITE_AUTH0_CLIENTID}

COPY --from=deps /app/refine/node_modules ./node_modules

COPY . .

RUN npm run build

FROM nginx:1.21.3-alpine as runner

ENV NODE_ENV production

COPY --from=builder /app/refine/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
