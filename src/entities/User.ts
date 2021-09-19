export enum UserRoles {
    Standard,
    Admin,
}

export interface IUser {
    id: number;
    name: string;
    email: string;
    password?: string;
    pwdHash: string;
    role: UserRoles;
}

export class User implements IUser {

    public id: number;
    public name: string;
    public email: string;
    public role: UserRoles;
    public pwdHash: string;
    public password: string;

    constructor(
        nameOrUser?: string | IUser,
        email?: string,
        password?: string,
        role?: UserRoles,
        pwdHash?: string,
        id?: number,
    ) {
        if (typeof nameOrUser === 'string' || typeof nameOrUser === 'undefined') {
            this.name = nameOrUser || '';
            this.email = email || '';
            this.role = role || UserRoles.Standard;
            this.password = password || '';
            this.pwdHash = pwdHash || '';
            this.id = id || -1;
        } else {
            this.password = nameOrUser.password || '';
            this.name = nameOrUser.name;
            this.email = nameOrUser.email;
            this.role = nameOrUser.role;
            this.pwdHash = nameOrUser.pwdHash;
            this.id = nameOrUser.id;
        }
    }
}
