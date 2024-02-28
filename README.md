# Stock Checker project for Peak

### Requirements

- Node
- Docker

## Steps to run this project:

1. Run `npm i` command
2. Fill the `.env` file based on the `.env.example` file \

- **If you already have a database you can skip 3 and 4 and use the `npm run docker-db-start` command.**

3. Make shore that docker engine is running. Start the dockerized db with the `npm run init-db` command
4. Run migrations with the `Run TypeORM Migrations` vscode task or \
   with the `npm run typeorm migration:run -- -d src/data-source.ts` command
5. Run `npm run dev` command to start in dev mode

## Usage

- `PUT route /stock/:symbol` : Call to **start** and to **stop** the periodic checking.

- `GET route /stock/:symbol` : Call it to get the `currentStockPrice`, the `movingAVG`, and the `lastUpdated` values.

## Limitations

1. Alpha Vantage has an api limitation to **25 requests** per day on the free plan.
2. Alpha Vantage has an api limitation on the free plan to show only prices of the previous day so the **price will stay the same**.
