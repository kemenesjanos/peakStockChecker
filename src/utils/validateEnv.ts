import { cleanEnv, port, str } from "envalid";

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    DB_PORT: port(),
    DB_PASSWORD: str(),
    DB_USERNAME: str(),
    DB_HOST: str(),
    DB_NAME: str(),
    ALPHA_VANTAGE_API_KEY: str(),
  });
};

export default validateEnv;
