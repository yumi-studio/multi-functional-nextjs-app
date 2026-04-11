### Drizzle usages for Freechat

```sh
# Go to project root folder
cd /path/to/project

# Generate migrations script
npx drizzle-kit generate --config="./src/modules/freechat/drizzle.config.ts"

# Push migrations to postgres service
npx drizzle-kit push --config="./src/modules/freechat/drizzle.config.ts"
```
