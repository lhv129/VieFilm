import 'dotenv/config';

export const env = {
    MONGODB_URI: process.env.MONGODB_URI,
    DATABASE_NAME: process.env.DATABASE_NAME,
    APP_HOST: process.env.APP_HOST,
    APP_PORT: process.env.APP_PORT,
    APP: process.env.APP,


    CLOUD_NAME: process.env.CLOUD_NAME,
    API_KEY: process.env.API_KEY,
    API_SECRET: process.env.API_SECRET,
}