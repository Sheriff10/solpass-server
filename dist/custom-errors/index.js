"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFound = exports.Forbidden = exports.Unauthenticated = exports.BadRequest = exports.CustomHttpError = void 0;
class CustomHttpError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.CustomHttpError = CustomHttpError;
class BadRequest extends CustomHttpError {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequest = BadRequest;
class Unauthenticated extends CustomHttpError {
    constructor(message) {
        super(message, 401);
    }
}
exports.Unauthenticated = Unauthenticated;
class Forbidden extends CustomHttpError {
    constructor(message) {
        super(message, 403);
    }
}
exports.Forbidden = Forbidden;
class NotFound extends CustomHttpError {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFound = NotFound;
