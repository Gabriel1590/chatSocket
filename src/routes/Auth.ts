import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import StatusCodes from 'http-status-codes';

import UserDao from '@daos/User/UserDao.mock';
import { JwtService } from '@shared/JwtService';
import {
    paramMissingError,
    loginFailedErr,
    cookieProps,
    userAlreadyExistsErr
} from '@shared/constants';

const userDao = new UserDao();
const jwtService = new JwtService();
const { BAD_REQUEST, OK, UNAUTHORIZED, CREATED } = StatusCodes;



/**
 * Signup user.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function signup(req: Request, res: Response) {
    // Check email and password present
    const { user, user: { email, password } } = req.body;
    if (!user || !email || !password) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }

    // Fetch user
    const userFinded = await userDao.getOne(email);
    if (userFinded) {
        return res.status(UNAUTHORIZED).json({
            error: userAlreadyExistsErr,
        });
    }

    // Create User
    const newUser = await userDao.add(user);
    
    // Setup Admin Cookie
    const jwt = await jwtService.getJwt({
        id: newUser.id,
        role: newUser.role,
        name: newUser.name,
    });
    const { key, options } = cookieProps;
    res.cookie(key, jwt, options);
    
    return res.status(CREATED).end();
}

/**
 * Add one user.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
 export async function addOneUser(req: Request, res: Response) {
    const { user } = req.body;
    if (!user) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    await userDao.add(user);
    return res.status(CREATED).end();
}

/**
 * Login in a user.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function login(req: Request, res: Response) {
    // Check email and password present
    const { email, password } = req.body;
    if (!(email && password)) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    // Fetch user
    const user = await userDao.getOne(email);
    if (!user) {
        return res.status(UNAUTHORIZED).json({
            error: loginFailedErr,
        });
    }
    // Check password
    const pwdPassed = await bcrypt.compare(password, user.pwdHash);
    if (!pwdPassed) {
        return res.status(UNAUTHORIZED).json({
            error: loginFailedErr,
        });
    }
    // Setup Admin Cookie
    const jwt = await jwtService.getJwt({
        id: user.id,
        role: user.role,
        name: user.name,
    });
    const { key, options } = cookieProps;
    res.cookie(key, jwt, options);
    // Return
    return res.status(OK).end();
}


/**
 * Logout the user.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export function logout(req: Request, res: Response) {
    const { key, options } = cookieProps;
    res.clearCookie(key, options);
    return res.status(OK).end();
}

