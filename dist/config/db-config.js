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
const mongoose_1 = __importDefault(require("mongoose"));
const secret_config_1 = __importDefault(require("./secret-config"));
const { MONGODB_URI } = secret_config_1.default;
// Function to connect to MongoDB
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(MONGODB_URI);
            console.info("Database Connected Successfully");
        }
        catch (error) {
            console.error("Unable to connect to database: ", error);
            process.exit(1); // Exit the process with failure
        }
    });
}
// Call the connect function
connectDB();
// Handle events
mongoose_1.default.connection.on("connected", () => {
    console.info("Mongoose connected to DB");
});
mongoose_1.default.connection.on("error", (err) => {
    console.error("Mongoose connection error: ", err);
});
mongoose_1.default.connection.on("disconnected", () => {
    console.info("Mongoose disconnected");
});
// If the Node process ends, close the Mongoose connection
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
    console.info("Mongoose connection closed due to app termination");
    process.exit(0);
}));
