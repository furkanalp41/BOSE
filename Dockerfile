# ── Stage 1: Build React frontend ────────────────────────────────────────────
FROM node:20-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Build Go backend ───────────────────────────────────────────────
FROM golang:1.22-alpine AS backend
WORKDIR /app/backend
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /bose-server .

# ── Stage 3: Production image ───────────────────────────────────────────────
FROM alpine:3.19
RUN apk add --no-cache ca-certificates
WORKDIR /app

COPY --from=backend /bose-server ./bose-server
COPY --from=frontend /app/frontend/dist ./frontend/dist

ENV PORT=8080
EXPOSE 8080

CMD ["./bose-server"]
