import { cleanEnv, port, str } from "envalid";

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    DB_PORT: port(),
    DB_HOST: str(),
    DB_NAME: str(),
  });
};

export default validateEnv;
