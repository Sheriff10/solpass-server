"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routeNotFound = (req, res, next) => {
    return res.status(404).json({ message: "Route does not exists" });
};
exports.default = routeNotFound;
