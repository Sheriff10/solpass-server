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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Schema definition for the Developer model
const DeveloperSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    apikeys: [
        {
            name: {
                type: String,
                required: true,
            },
            key: {
                type: String,
                required: true,
            },
            createTime: {
                type: Date,
                default: Date.now, // Automatically set to current date
            },
        },
    ],
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
});
// Password hashing before saving the developer
DeveloperSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        const salt = yield bcrypt_1.default.genSalt(10);
        this.password = yield bcrypt_1.default.hash(this.password, salt);
        next();
    });
});
// Method to compare password
DeveloperSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt_1.default.compare(candidatePassword, this.password);
};
const Developer = (0, mongoose_1.model)("Developer", DeveloperSchema);
exports.default = Developer;
