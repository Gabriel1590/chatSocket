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
exports.logout = exports.login = exports.addOneUser = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const UserDao_mock_1 = __importDefault(require("@daos/User/UserDao.mock"));
const JwtService_1 = require("@shared/JwtService");
const constants_1 = require("@shared/constants");
const userDao = new UserDao_mock_1.default();
const jwtService = new JwtService_1.JwtService();
const { BAD_REQUEST, OK, UNAUTHORIZED, CREATED } = http_status_codes_1.default;
/**
 * Signup user.
 *
 * @param req
 * @param res
 * @returns
 */
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check email and password present
        const { user, user: { email, password } } = req.body;
        if (!user || !email || !password) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        // Fetch user
        const userFinded = yield userDao.getOne(email);
        if (userFinded) {
            return res.status(UNAUTHORIZED).json({
                error: constants_1.userAlreadyExistsErr,
            });
        }
        // Create User
        const newUser = yield userDao.add(user);
        // Setup Admin Cookie
        const jwt = yield jwtService.getJwt({
            id: newUser.id,
            role: newUser.role,
            name: newUser.name,
        });
        const { key, options } = constants_1.cookieProps;
        res.cookie(key, jwt, options);
        return res.status(CREATED).end();
    });
}
exports.signup = signup;
/**
 * Add one user.
 *
 * @param req
 * @param res
 * @returns
 */
function addOneUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user } = req.body;
        if (!user) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        yield userDao.add(user);
        return res.status(CREATED).end();
    });
}
exports.addOneUser = addOneUser;
/**
 * Login in a user.
 *
 * @param req
 * @param res
 * @returns
 */
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check email and password present
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        // Fetch user
        const user = yield userDao.getOne(email);
        if (!user) {
            return res.status(UNAUTHORIZED).json({
                error: constants_1.loginFailedErr,
            });
        }
        // Check password
        const pwdPassed = yield bcrypt_1.default.compare(password, user.pwdHash);
        if (!pwdPassed) {
            return res.status(UNAUTHORIZED).json({
                error: constants_1.loginFailedErr,
            });
        }
        // Setup Admin Cookie
        const jwt = yield jwtService.getJwt({
            id: user.id,
            role: user.role,
            name: user.name,
        });
        const { key, options } = constants_1.cookieProps;
        res.cookie(key, jwt, options);
        // Return
        return res.status(OK).end();
    });
}
exports.login = login;
/**
 * Logout the user.
 *
 * @param req
 * @param res
 * @returns
 */
function logout(req, res) {
    const { key, options } = constants_1.cookieProps;
    res.clearCookie(key, options);
    return res.status(OK).end();
}
exports.logout = logout;
