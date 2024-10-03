"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const getStringConfigValue = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`${key} was not set in environment variable`);
    }
    return value;
};
const getNumericConfigValue = (key) => {
    const stringValue = getStringConfigValue(key);
    const numericValue = Number(stringValue);
    if (!numericValue) {
        throw new Error(`${key} is expected to be a numeric value.`);
    }
    return numericValue;
};
const secret = {
    ORIGIN: getStringConfigValue("ORIGIN"),
    MONGODB_URI: getStringConfigValue("MONGODB_URI"),
    RECLAIM_APP_ID: getStringConfigValue("RECLAIM_APP_ID"),
    RECLAIM_APP_SECRET: getStringConfigValue("RECLAIM_APP_SECRET"),
    CALLBACK_URL: getStringConfigValue("CALLBACK_URL"),
    JWT_ACCESS_KEY: getStringConfigValue("JWT_ACCESS_KEY"),
    JWT_REFRESH_KEY: getStringConfigValue("JWT_REFRESH_KEY"),
    NODE_ENV: process.env.NODE_ENV || "development",
};
exports.default = secret;
