"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRoles = void 0;
var UserRoles;
(function (UserRoles) {
    UserRoles[UserRoles["Standard"] = 0] = "Standard";
    UserRoles[UserRoles["Admin"] = 1] = "Admin";
})(UserRoles = exports.UserRoles || (exports.UserRoles = {}));
class User {
    constructor(nameOrUser, email, password, role, pwdHash, id) {
        if (typeof nameOrUser === 'string' || typeof nameOrUser === 'undefined') {
            this.name = nameOrUser || '';
            this.email = email || '';
            this.role = role || UserRoles.Standard;
            this.password = password || '';
            this.pwdHash = pwdHash || '';
            this.id = id || -1;
        }
        else {
            this.password = nameOrUser.password || '';
            this.name = nameOrUser.name;
            this.email = nameOrUser.email;
            this.role = nameOrUser.role;
            this.pwdHash = nameOrUser.pwdHash;
            this.id = nameOrUser.id;
        }
    }
}
exports.User = User;
