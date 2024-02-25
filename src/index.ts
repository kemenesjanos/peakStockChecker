import { AppDataSource } from "./data-source";

AppDataSource.initialize()
  .then(async () => {
    console.log("Running");
  })
  .catch((error) => console.log(error));
