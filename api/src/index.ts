import { app } from "./http/server";
import { env } from "./config/env";

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server is running on port ${env.PORT} 🚀🚀🚀`);
});
