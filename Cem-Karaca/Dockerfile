FROM golang:1.22-alpine AS builder

WORKDIR /src
COPY go.mod go.sum* ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -o /out/bose-cem .

FROM alpine:3.20
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=builder /out/bose-cem /app/bose-cem

ENV PORT=8081
EXPOSE 8081
ENTRYPOINT ["/app/bose-cem"]
