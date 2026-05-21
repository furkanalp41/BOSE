FROM golang:1.22-alpine AS builder

WORKDIR /src
COPY go.mod go.sum* ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -o /out/bose-enes .

FROM alpine:3.20
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=builder /out/bose-enes /app/bose-enes

ENV PORT=8083
EXPOSE 8083
ENTRYPOINT ["/app/bose-enes"]
