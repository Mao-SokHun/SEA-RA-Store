import { io, Socket } from 'socket.io-client';
import { getStoredToken } from './api';

let socket: Socket | null = null;

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export function getSocket(): Socket {
  if (!socket) {
    const token = getStoredToken();
    socket = io(SOCKET_URL, {
      auth: {
        token: token ? `Bearer ${token}` : '',
      },
      autoConnect: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to Nexus Escrow WebSocket Gateway');
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from Nexus WebSocket Gateway:', reason);
    });

    socket.on('connect_error', (err) => {
      console.warn('⚠️ WebSocket connection error:', err.message);
    });
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
