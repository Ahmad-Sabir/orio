const { v4: uuidv4 } = require('uuid');

exports.onConnection = (socket) => {
    socket.emit('roomId', { code: uuidv4() });
    socket.on('join', async (roomId, callback) => {
        console.log(roomId)
        //await addUser({ socketId: socket.id, roomId, ...user });
        socket.join(roomId);
        socket.to(roomId).emit('join', { roomId: `${roomId} has joined` });
        if (typeof callback === 'function') {
            callback({ status: 'ok' });
        }
    });
    socket.on('authToken', (authToken, roomId, callback) => {
        socket.to(roomId).emit('authToken', { authToken });
        if (typeof callback === 'function') {
            callback({ status: 'ok' });
        }
    });
    // socket.on('sendMessage', async (msgObj, roomId, callback) => {
    //     try {
    //         const user = await getUser(socket.id);
    //         const room = await ChatRoom.findById(roomId);
    //         const user1 = room.users[0];
    //         const user2 = room.users[1];
    //         let from, to, msg;
    //         if (user1.equals(user.userId)) {
    //             from = user1;
    //             to = user2;
    //         } else {
    //             from = user2;
    //             to = user1;
    //         }
    //         if (await OnlineUsers.findOne({ userId: to, roomId: roomId })) {
    //             msg = await Message.create({
    //                 chatRoom: roomId,
    //                 from: from,
    //                 to: to,
    //                 message: msgObj.message || undefined,
    //                 files: msgObj.files || undefined,
    //                 estimate: msgObj.estimate || undefined,
    //                 status: 'read',
    //             });
    //         } else {
    //             msg = await Message.create({
    //                 chatRoom: roomId,
    //                 from: from,
    //                 to: to,
    //                 message: msgObj.message || undefined,
    //                 files: msgObj.files || undefined,
    //                 estimate: msgObj.estimate || undefined,
    //             });
    //             const chat = await Message.findById(msg._id)
    //                 .populate('from', '-password')
    //                 .populate('to', '-password');
    //             if (chat.to.deviceId && chat.to.deviceId.length > 0) {
    //                 await sendCustomNotifications(chat);
    //             }
    //         }
    //         if (msg) {
    //             const message = await Message.findById(msg._id).populate('from to');
    //             socket.to(roomId).emit('message', message);
    //             callback({ status: { s: socket.id, r: roomId } });
    //         }
    //     } catch (error) {
    //         return new Error(error);
    //     }
    // });
    socket.on('logout', async (roomId, callback) => {
        socket.to(roomId).emit('logout');
        if (typeof callback === 'function') {
            callback({ status: 'ok' });
        }
    });
    socket.on('disconnect', async () => {
        console.log(`disconnected ${socket.id}`);
        //await removeUser(socket.id);
        //socket.to(roomId).emit('disconnect', { authToken });
    });
};

// const addUser = async ({ socketId, _id, roomId }) => {
//     const alreadyExist = await OnlineUsers.findOne({ socketId: socketId });
//     if (alreadyExist) {
//         await OnlineUsers.findByIdAndDelete(alreadyExist._id);
//         const user = await OnlineUsers.create({ socketId: socketId, userId: _id, roomId: roomId });
//         return user;
//     }
//     const user = await OnlineUsers.create({ socketId: socketId, userId: _id, roomId: roomId });
//     return user;
// };

// const getUser = async (id) => {
//     return await OnlineUsers.findOne({ socketId: id });
// };

// const removeUser = async (id) => {
//     const user = await OnlineUsers.findOne({ socketId: id });
//     if (user) {
//         await OnlineUsers.findByIdAndDelete(user._id);
//     }
// };
