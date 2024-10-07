import { CLIENT_VERSION } from '../constants.js';
import { createItem } from '../models/item.model.js';
import { createStage, setStage } from '../models/stage.model.js';
import { getUser, removeUser } from '../models/user.model.js';
import handlerMappings from './handlermapping.js';

// 종료와 접속 함수
export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id);
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users: ', getUser());
};

export const handleConnection = (socket, uuid) => {
  console.log(`New user connected!: ${uuid} with socket ID ${socket.id}`);
  console.log('Current users: ', getUser());

  createStage(uuid);
  createItem(uuid);

  socket.emit('connection', { uuid });
};

export const handlerEvent = (io, socket, data) => {
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
    return;
  }

  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return;
  }

  const response = handler(data.userId, data.payload);

  // 모든 유저에게 정보를 보내야 할 때
  if (response.broadcast) {
    io.emit('response', 'broadcast');
    return;
  }

  // 접속한 유저에게만 정보를 보내야 할 때
  socket.emit('response', response);
};
