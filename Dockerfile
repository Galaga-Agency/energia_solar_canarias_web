FROM node:20-alpine AS builder

WORKDIR /app

# scripts/ must be present before npm ci — postinstall runs scripts/patch-payload.mjs
COPY package*.json ./
COPY scripts ./scripts
RUN npm ci

COPY . .

# Payload initializes during `next build`; provide a secret + local DB so the
# build never fails on "missing secret key". Real values are injected at runtime.
ARG PAYLOAD_SECRET=build-time-placeholder-secret
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV DATABASE_URI=file:./esc.db

# NEXT_PUBLIC_* are inlined by Next.js at BUILD time, so they must be present
# for `next build` — a runtime env var is too late. Pass via build args.
ARG NEXT_PUBLIC_GTM_ID
ARG NEXT_PUBLIC_GA4_ID
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_GTM_ID=$NEXT_PUBLIC_GTM_ID
ENV NEXT_PUBLIC_GA4_ID=$NEXT_PUBLIC_GA4_ID
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# scripts/ present so postinstall re-applies the Payload patch on the prod install
RUN npm ci --omit=dev

EXPOSE 3000

CMD ["npm", "start"]
