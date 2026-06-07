# BOSE — Infrastructure & Database Guide

A practical map of **what data lives where**, **which env vars control it**, and **how to log in
and inspect it**. Reflects the *actual* current state of the repo (verified, not aspirational).

---

## 1. TL;DR — which database are we using?

**Local Docker Postgres.** All five Go services point at the same local database:

```
DB_URL=postgres://bose:bose@localhost:5432/bose?sslmode=disable
```

- **Not** Render / not any cloud DB. The old Render Postgres is **no longer used** by any service.
- One shared database (`bose`) — every microservice connects to it and `AutoMigrate`s its own tables.
- `sslmode=disable` because it's a local container (no TLS). Render previously needed `sslmode=require`.

> ⚠️ Security note: the previously-leaked Render credentials are still present in **git history** and
> remain **unrotated**. They are not used at runtime anymore, but rotating/scrubbing them is still
> an open task (see `security/REMEDIATION.md`, kept local).

---

## 2. The three infrastructure containers (`docker-compose.yml`)

| Service   | Image                          | Host port        | Purpose                              |
|-----------|--------------------------------|------------------|--------------------------------------|
| postgres  | `postgres:16-alpine`           | `5432`           | Shared relational DB (`bose`)        |
| redis     | `redis:7-alpine`               | `6379`           | Cache-aside (alerts, market prices)  |
| rabbitmq  | `rabbitmq:3-management-alpine` | `5672` + `15672` | Event broker (`bose.events` topic)   |

Bring them up:

```bash
docker compose up -d postgres redis rabbitmq
# or the whole stack (infra + 5 backends + nothing else):
docker compose up -d
```

Postgres data persists in the named volume **`bose_pg_data`** (survives `docker compose down`; wiped
only by `docker compose down -v`).

---

## 3. Environment variables that control it

Each service has its own `<Member>/.env` (loaded via `godotenv`). The four that matter, identical
across all five services so they share one DB + one JWT trust domain:

| Variable        | Value (local)                                              | Controls                          |
|-----------------|------------------------------------------------------------|-----------------------------------|
| `DB_URL`        | `postgres://bose:bose@localhost:5432/bose?sslmode=disable` | Which Postgres each service uses  |
| `REDIS_URL`     | `redis://localhost:6379`                                   | Cache backend                     |
| `RABBITMQ_URL`  | `amqp://guest:guest@localhost:5672/`                       | Event broker                      |
| `JWT_SECRET`    | `bose_super_gizli_anahtar_2026`                            | Token signing — **shared** so a token from one service is accepted by all |

`.env` files are **git-ignored** (`*.env`); `.env.example` templates are committed with placeholders.
`start_project.sh` injects `PORT` per service (8080–8084), overriding any `PORT` in `.env`.

To switch the whole system to a different DB (e.g. back to a cloud Postgres): change `DB_URL` in all
five `.env` files (use `sslmode=require` for a TLS cloud DB) — no code changes needed.

---

## 4. Service → port → data map

| Service (member)            | API port | Owns / writes                                   |
|-----------------------------|----------|-------------------------------------------------|
| Furkan-Alp-Gunay            | `:8080`  | `users`, `login_logs`, `order_logs` (audit)     |
| Cem-Karaca                  | `:8081`  | `orders`, debits `users.virtual_balance`        |
| Salih-Arda-Katircioglu      | `:8082`  | `price_alerts`, `chat_messages`                 |
| Enes-Coban                  | `:8083`  | `watchlists`, `watchlist_assets`                |
| Yakup-Efe-Celebi            | `:8084`  | `market_assets`, publishes `price.tick`         |

All tables live in the **same `bose` database** (GORM `AutoMigrate` per service on boot).

---

## 5. Where to log in / inspect the data

**Postgres (the actual data):**
```bash
docker compose exec postgres psql -U bose -d bose
# then, inside psql:
\dt                         -- list all tables
SELECT id, email, virtual_balance FROM users;
SELECT * FROM orders ORDER BY id DESC LIMIT 20;
SELECT * FROM order_logs;   -- audit rows written by Furkan from RabbitMQ order.filled events
\q
```
GUI alternative: connect any client (DBeaver/TablePlus/pgAdmin) to
`host=localhost port=5432 db=bose user=bose password=bose`.

**RabbitMQ (events / queues) — has a web UI:**
- Open **http://localhost:15672** → login **guest / guest**.
- "Exchanges" → `bose.events` (topic). "Queues" → `bose.furkan.order-filled`, `bose.enes.user-registered`,
  Salih's `price.tick` queue. Watch message rates as you register users / place orders.

**Redis (cache):**
```bash
docker compose exec redis redis-cli
# inside:
KEYS *                      -- e.g. alerts:user:1, prices:latest
TTL alerts:user:1           -- cache-aside TTL (60s for Salih alerts)
GET <key>
```

---

## 6. Quick health check

```bash
docker compose ps                                   # all 3 infra containers "healthy"
curl localhost:8080/ ; curl localhost:8084/         # backends respond with service JSON
```
Then register a user on Furkan (`:8080`) → it publishes `user.registered` → Enes (`:8083`) auto-creates
a "Default" watchlist (visible in RabbitMQ UI + the `watchlists` table). Placing an order on Cem
(`:8081`) publishes `order.filled` → Furkan writes an `order_logs` row.

> Note on host port 6379: if another project already runs Redis on 6379, the BOSE redis container may
> fail to bind. Either stop the other one, or run the app services against the existing local Redis
> (they connect to `localhost:6379` directly).
