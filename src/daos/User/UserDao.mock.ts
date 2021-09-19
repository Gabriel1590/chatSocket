import { IUser, UserRoles } from '@entities/User';
import { IUserDao } from './UserDao';
import MockDaoMock from '../MockDb/MockDao.mock';
import bcrypt from 'bcrypt';
import { pwdSaltRounds } from '@shared/constants';


class UserDao extends MockDaoMock implements IUserDao {


    public async getOne(email: string): Promise<IUser | null> {
        const db = await super.openDb();
        for (const user of db.users) {
            if (user.email === email) {
                return user;
            }
        }
        return null;
    }


    public async getAll(): Promise<IUser[]> {
        const db = await super.openDb();
        return db.users;
    }


    public async add(user: IUser): Promise<IUser> {
        const db = await super.openDb();
        
        const lastUser = db.users[db.users.length - 1];
        user.id = lastUser.id + 1;
        user.pwdHash = bcrypt.hashSync(user.password || '', pwdSaltRounds);
        delete user.password;
        user.role = UserRoles.Standard;

        db.users.push(user);
        await super.saveDb(db);
        return user;
    }


    public async update(user: IUser): Promise<void> {
        const db = await super.openDb();
        for (let i = 0; i < db.users.length; i++) {
            if (db.users[i].id === user.id) {
                db.users[i] = user;
                await super.saveDb(db);
                return;
            }
        }
        throw new Error('User not found');
    }


    public async delete(id: number): Promise<void> {
        const db = await super.openDb();
        for (let i = 0; i < db.users.length; i++) {
            if (db.users[i].id === id) {
                db.users.splice(i, 1);
                await super.saveDb(db);
                return;
            }
        }
        throw new Error('User not found');
    }
}

export default UserDao;
