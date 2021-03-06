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
const User_1 = require("@entities/User");
const MockDao_mock_1 = __importDefault(require("../MockDb/MockDao.mock"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const constants_1 = require("@shared/constants");
class UserDao extends MockDao_mock_1.default {
    getOne(email) {
        const _super = Object.create(null, {
            openDb: { get: () => super.openDb }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield _super.openDb.call(this);
            for (const user of db.users) {
                if (user.email === email) {
                    return user;
                }
            }
            return null;
        });
    }
    getAll() {
        const _super = Object.create(null, {
            openDb: { get: () => super.openDb }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield _super.openDb.call(this);
            return db.users;
        });
    }
    add(user) {
        const _super = Object.create(null, {
            openDb: { get: () => super.openDb },
            saveDb: { get: () => super.saveDb }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield _super.openDb.call(this);
            const lastUser = db.users[db.users.length - 1];
            user.id = lastUser.id + 1;
            user.pwdHash = bcrypt_1.default.hashSync(user.password || '', constants_1.pwdSaltRounds);
            delete user.password;
            user.role = User_1.UserRoles.Standard;
            db.users.push(user);
            yield _super.saveDb.call(this, db);
            return user;
        });
    }
    update(user) {
        const _super = Object.create(null, {
            openDb: { get: () => super.openDb },
            saveDb: { get: () => super.saveDb }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield _super.openDb.call(this);
            for (let i = 0; i < db.users.length; i++) {
                if (db.users[i].id === user.id) {
                    db.users[i] = user;
                    yield _super.saveDb.call(this, db);
                    return;
                }
            }
            throw new Error('User not found');
        });
    }
    delete(id) {
        const _super = Object.create(null, {
            openDb: { get: () => super.openDb },
            saveDb: { get: () => super.saveDb }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield _super.openDb.call(this);
            for (let i = 0; i < db.users.length; i++) {
                if (db.users[i].id === id) {
                    db.users.splice(i, 1);
                    yield _super.saveDb.call(this, db);
                    return;
                }
            }
            throw new Error('User not found');
        });
    }
}
exports.default = UserDao;
