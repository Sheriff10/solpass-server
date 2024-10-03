"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan")); // Import Morgan
const routes_1 = __importDefault(require("./routes"));
const dotenv_1 = require("dotenv");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const secret_config_1 = __importDefault(require("./config/secret-config"));
require("./config/db-config"); // Import database connection
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
// Load environment variables
(0, dotenv_1.configDotenv)();
const app = (0, express_1.default)();
// Use middlewares
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: secret_config_1.default.ORIGIN,
    credentials: true,
}));
// Morgan middleware to log HTTP requests
if (secret_config_1.default.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev")); // Logs concise colored output for development
}
else {
    app.use((0, morgan_1.default)("combined")); // Standard Apache combined log output for production
}
app.use(routes_1.default);
app.use(error_handler_1.default);
const port = process.env.PORT || 5000;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Connecting to database...");
    app.listen(port, () => {
        const appMessage = secret_config_1.default.NODE_ENV === "development"
            ? `App is running on http://127.0.0.1:${port}`
            : "App is live!";
        console.log(appMessage);
    });
});
// test auto deploy -- v5
start();
