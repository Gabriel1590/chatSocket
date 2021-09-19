"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const routes_1 = __importDefault(require("./routes"));
const Logger_1 = __importDefault(require("@shared/Logger"));
const constants_1 = require("@shared/constants");
const app = (0, express_1.default)();
const { BAD_REQUEST } = http_status_codes_1.default;
/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)(constants_1.cookieProps.secret));
// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Security
if (process.env.NODE_ENV === 'production') {
    app.use((0, helmet_1.default)());
}
// Add APIs
app.use('/api', routes_1.default);
// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
    Logger_1.default.err(err, true);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});
/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/
const viewsDir = path_1.default.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path_1.default.join(__dirname, 'public');
app.use(express_1.default.static(staticDir));
// Login page
app.get('/', (req, res) => {
    const jwt = req.signedCookies[constants_1.cookieProps.key];
    if (!jwt) {
        return res.sendFile('login.html', { root: viewsDir });
    }
    else {
        return res.redirect('/users');
    }
});
// Users page
app.get('/users', (req, res) => {
    const jwt = req.signedCookies[constants_1.cookieProps.key];
    if (!jwt) {
        return res.redirect('/');
    }
    else {
        return res.sendFile('users.html', { root: viewsDir });
    }
});
// Chat page
app.get('/chat', (req, res) => {
    const jwt = req.signedCookies[constants_1.cookieProps.key];
    if (!jwt) {
        return res.redirect('/');
    }
    else {
        return res.sendFile('chat.html', { root: viewsDir });
    }
});
/************************************************************************************
 *                                   Setup Socket.io
 * Tutorial used for this: https://www.valentinog.com/blog/socket-react/
 ***********************************************************************************/
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
io.sockets.on('connect', () => {
    return app.set('socketio', io);
});
/************************************************************************************
 *                              Export Server
 ***********************************************************************************/
exports.default = server;
