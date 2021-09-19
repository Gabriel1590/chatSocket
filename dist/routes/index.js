"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("./middleware");
const Auth_1 = require("./Auth");
const Users_1 = require("./Users");
const Chat_1 = require("./Chat");
// Auth router
const authRouter = (0, express_1.Router)();
authRouter.post('/login', Auth_1.login);
authRouter.post('/signup', Auth_1.signup);
authRouter.get('/logout', Auth_1.logout);
// User router
const userRouter = (0, express_1.Router)();
userRouter.get('/all', Users_1.getAllUsers);
userRouter.post('/add', Users_1.addOneUser);
userRouter.put('/update', Users_1.updateOneUser);
userRouter.delete('/delete/:id', Users_1.deleteOneUser);
// Chat router
const chatRouter = (0, express_1.Router)();
chatRouter.get('/connect-socket-room/:socketId', Chat_1.connectSocketRm);
chatRouter.post('/emit-message', Chat_1.emitMessage);
// Base router (serves all others)
const baseRouter = (0, express_1.Router)();
baseRouter.use('/auth', authRouter);
baseRouter.use('/users', middleware_1.authMw, userRouter);
baseRouter.use('/chat', middleware_1.authMw, chatRouter);
exports.default = baseRouter;
