
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    const token = Cookies.get('accessToken');
    socket = io('http://localhost:3001/market', {
      auth: { token },
      transports: ['websocket'],
      autoConnect: false
    });
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  const token = Cookies.get('accessToken');
  if (s && token) {
    s.auth = { token };
    s.connect();
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
