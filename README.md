# Stock Checker project for Peak

Steps to run this project:

1. Run `npm i` command
2. Fill the `.env` file based on the `.env.example` file
3. Start a dockerized db with the `npm run init-db`
4. Run migrations with the `Run TypeORM Migrations` vscode task or \
   with the `npm run typeorm migration:run -- -d src/data-source.ts` command
5. Run `npm run dev` command to start in dev mode
