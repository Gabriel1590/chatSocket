"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitMessage = exports.connectSocketRm = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const { BAD_REQUEST, OK } = http_status_codes_1.default;
const SOCKET_ROOM_NAME = 'jet-logger-chat-room';
/**
 * Connect to socket room.
 *
 * @param req
 * @param res
 * @returns
 */
function connectSocketRm(req, res) {
    // Get the socket
    const io = req.app.get('socketio');
    const socket = io.sockets.sockets.get(req.params.socketId);
    if (!socket) {
        return res.status(BAD_REQUEST).end();
    }
    // Leave room if already connected, and join that socket-id to the room
    socket.leave(SOCKET_ROOM_NAME);
    socket.join(SOCKET_ROOM_NAME);
    // Return
    return res.status(OK).end();
}
exports.connectSocketRm = connectSocketRm;
/**
 * Emit message.
 *
 * @param req
 * @param res
 * @returns
 */
function emitMessage(req, res) {
    const { sessionUser } = res;
    const { message, socketId } = req.body;
    // Get the socket
    const io = req.app.get('socketio');
    const socket = io.sockets.sockets.get(socketId);
    if (!socket) {
        return res.status(BAD_REQUEST).end();
    }
    // Send a message to the room
    const room = socket.to(SOCKET_ROOM_NAME);
    room.emit('emit-msg', {
        timestamp: Date.now(),
        content: message,
        senderName: sessionUser.name,
    });
    // Return
    return res.status(OK).json({
        senderName: sessionUser.name,
    });
}
exports.emitMessage = emitMessage;
