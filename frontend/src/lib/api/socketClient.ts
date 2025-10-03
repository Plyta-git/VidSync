import { io, type Socket } from 'socket.io-client';

const SOCKET_BASE_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3000';

export function createSocketClient(namespace: string, options: Parameters<typeof io>[1] = {}): Socket {
  return io(`${SOCKET_BASE_URL}${namespace}`, {
    autoConnect: false,
    reconnectionAttempts: 5,
    reconnectionDelay: 500,
    transports: ['websocket'],
    ...options,
  });
}
