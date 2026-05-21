FROM golang:1.22-alpine AS builder

WORKDIR /src
COPY go.mod go.sum* ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -o /out/bose-salih .

FROM alpine:3.20
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=builder /out/bose-salih /app/bose-salih

ENV PORT=8082
EXPOSE 8082
ENTRYPOINT ["/app/bose-salih"]
