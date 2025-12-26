process.env.NODE_ENV = "test";

// o dotenv deve carregar o .env.test AQUI
process.env.DOTENV_CONFIG_PATH = ".env.test";

import "dotenv/config";
