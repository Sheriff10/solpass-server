import { configDotenv } from "dotenv";

configDotenv();

const getStringConfigValue = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} was not set in environment variable`);
  }
  return value;
};

const getNumericConfigValue = (key: string) => {
  const stringValue: string = getStringConfigValue(key);
  const numericValue: number = Number(stringValue);
  if (!numericValue) {
    throw new Error(`${key} is expected to be a numeric value.`);
  }
  return numericValue;
};
const secret = {
  MONGODB_URI: getStringConfigValue("MONGODB_URI"),
  RECLAIM_APP_ID: getStringConfigValue("RECLAIM_APP_ID"),
  RECLAIM_APP_SECRET: getStringConfigValue("RECLAIM_APP_SECRET"),
  CALLBACK_URL: getStringConfigValue("CALLBACK_URL"),
  JWT_ACCESS_KEY: getStringConfigValue("JWT_ACCESS_KEY"),
  JWT_REFRESH_KEY: getStringConfigValue("JWT_REFRESH_KEY"),
  NODE_ENV: process.env.NODE_ENV || "development",
};

export default secret;
