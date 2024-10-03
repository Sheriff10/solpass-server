"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = errorResponse;
exports.badReqResponse = badReqResponse;
exports.notFoundResponse = notFoundResponse;
exports.devResponse = devResponse;
const response = (res, status, message, info) => {
    return res.status(status).send({ message, info });
};
function errorResponse(res, message) {
    return res
        .status(500)
        .send({ error: message ? message : "Internal Server Error" });
}
function badReqResponse(res, message) {
    return res.status(400).send({ error: message ? message : "Bad request" });
}
function notFoundResponse(res, message) {
    return res.status(404).send({ error: message ? message : "Not Found" });
}
function devResponse(res, data) {
    return res.status(200).send(Object.assign(Object.assign({}, data), { success: true }));
}
exports.default = response;
