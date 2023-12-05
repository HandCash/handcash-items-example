import dotenv from "dotenv";

dotenv.config();

export const handCashConfig = {
    appId: process.env.HANDCASH_APP_ID as string,
    appSecret: process.env.HANDCASH_APP_SECRET as string,
    authToken: process.env.HANDCASH_AUTH_TOKEN as string,
    baseApiEndpoint: process.env.HANDCASH_BASE_API_ENDPOINT as string,
}

