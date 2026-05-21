FROM golang:1.22-alpine AS builder

WORKDIR /src
COPY go.mod go.sum* ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -o /out/bose-efe .

FROM alpine:3.20
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=builder /out/bose-efe /app/bose-efe

ENV PORT=8084
EXPOSE 8084
ENTRYPOINT ["/app/bose-efe"]
