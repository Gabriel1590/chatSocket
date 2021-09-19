"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomInt = exports.pErr = void 0;
const Logger_1 = __importDefault(require("./Logger"));
// Print an error if the error message in truthy
const pErr = (err) => {
    if (err) {
        Logger_1.default.err(err);
    }
};
exports.pErr = pErr;
// Get a random number between 1 and 1,000,000,000,000
const getRandomInt = () => {
    return Math.floor(Math.random() * 1000000000000);
};
exports.getRandomInt = getRandomInt;
