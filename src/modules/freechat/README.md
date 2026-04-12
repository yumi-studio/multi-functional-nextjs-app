### Drizzle usages for Freechat

```sh
# Go to project root folder
cd /path/to/project

# Generate migrations script
npx drizzle-kit generate --config="./src/modules/freechat/drizzle.config.ts"

# Push migrations to postgres service
npx drizzle-kit push --config="./src/modules/freechat/drizzle.config.ts"
```

### Install Postgres via docker

```sh
# Pull postgress image
docker pull postgres:16

# Run container
docker run -d \
  --name postgres-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=postgres \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:16
```