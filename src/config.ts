import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: "./.env" });
} else {
    dotenv.config();
}

export const {
    AUTH_BASE_URL,
    CLIENT_URL,
    GATEWAY_JWT_TOKEN,
    GIG_BASE_URL,
    JWT_TOKEN,
    ELASTIC_SEARCH_URL,
    MESSAGE_BASE_URL,
    NODE_ENV,
    ORDER_BASE_URL,
    REVIEW_BASE_URL,
    SECRET_KEY_ONE,
    SECRET_KEY_TWO,
    USERS_BASE_URL
} = process.env;
