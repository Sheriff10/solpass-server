"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const custom_errors_1 = require("../custom-errors");
const secret_config_1 = __importDefault(require("../config/secret-config"));
const axios_1 = require("axios");
const { CastError, ValidationError } = mongoose_1.Error;
const errorHandler = (error, req, res, next) => {
    console.log(error);
    if (error instanceof custom_errors_1.CustomHttpError) {
        return res.status(error.statusCode).json({ message: error.message });
    }
    if (error instanceof CastError) {
        const path = error.path === "_id" ? "id" : error.path;
        const message = `${path} expected ${error.kind}`;
        return res.status(400).json({ message });
    }
    if (error instanceof axios_1.AxiosError) {
        const message = `${error.message} \n ${error.stack}`;
        return res.status(400).json({ message });
    }
    // @ts-expect-error
    if (error.code === 11000) {
        // @ts-expect-error
        const message = `${Object.keys(error.keyValue)} already exists`;
        return res.status(400).json({ message });
    }
    /*
      For server errors,
      return the error in development.
      This allows for the error to be viewed
      and prevent having to come back to the console to view the error
    */
    if (secret_config_1.default.NODE_ENV === "development") {
        return res.status(500).json({ error, message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
};
exports.default = errorHandler;
