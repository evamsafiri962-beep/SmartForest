import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // core backend

const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket'],
});

export default socket;
