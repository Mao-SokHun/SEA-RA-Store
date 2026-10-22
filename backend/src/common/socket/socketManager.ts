import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyAccessToken } from '../utils/jwt';
import { config } from '../../config';
import { prisma } from '../../config/database';

export interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

let ioInstance: SocketIOServer | null = null;

export function initSocketServer(server: HttpServer): SocketIOServer {
  const io = new SocketIOServer(server, {
    cors: {
      origin: [config.frontendUrl, 'http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  // JWT Authentication Middleware for WebSockets
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      let rawToken =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization ||
        (socket.handshake.headers?.cookie?.match(/accessToken=([^;]+)/)?.[1]);

      if (!rawToken) {
        // Allow anonymous connection if needed, or enforce auth
        return next();
      }

      const token = typeof rawToken === 'string' && rawToken.startsWith('Bearer ')
        ? rawToken.slice(7)
        : rawToken;

      const payload = verifyAccessToken(token);
      const user = await prisma.user.findUnique({
        where: { id: BigInt(payload.sub) },
        select: { id: true, username: true, email: true, role: true, status: true },
      });

      if (user && user.status === 'active') {
        socket.user = {
          id: user.id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
        };
      }

      next();
    } catch {
      // Allow connection but without attached user, or reject
      next();
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userIdentifier = socket.user ? `${socket.user.username} (#${socket.user.id})` : 'Anonymous';
    console.log(`⚡ WebSocket client connected: ${socket.id} (${userIdentifier})`);

    // Join order room for escrow chat
    socket.on('join_order', async (orderNumber: string) => {
      try {
        if (!socket.user) {
          socket.emit('error', { message: 'Authentication required to join order room' });
          return;
        }

        // Verify order access
        const order = await prisma.order.findUnique({
          where: { orderNumber },
          select: { buyerId: true, sellerId: true },
        });

        if (!order) {
          socket.emit('error', { message: 'Order not found' });
          return;
        }

        const isParticipant =
          order.buyerId.toString() === socket.user.id ||
          order.sellerId.toString() === socket.user.id ||
          socket.user.role === 'admin';

        if (!isParticipant) {
          socket.emit('error', { message: 'Unauthorized access to order escrow room' });
          return;
        }

        socket.join(`order:${orderNumber}`);
        console.log(`User ${socket.user.username} joined room order:${orderNumber}`);
        socket.emit('joined_order', { orderNumber });
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Error joining room';
        socket.emit('error', { message: errorMsg });
      }
    });

    // Leave order room
    socket.on('leave_order', (orderNumber: string) => {
      socket.leave(`order:${orderNumber}`);
      console.log(`Socket ${socket.id} left room order:${orderNumber}`);
    });

    // Real-time typing indicators
    socket.on('typing', ({ orderNumber, isTyping }: { orderNumber: string; isTyping: boolean }) => {
      if (!socket.user) return;
      socket.to(`order:${orderNumber}`).emit('user_typing', {
        username: socket.user.username,
        isTyping,
      });
    });

    socket.on('disconnect', () => {
      console.log(`🔌 WebSocket client disconnected: ${socket.id}`);
    });
  });

  ioInstance = io;
  return io;
}

export function getIO(): SocketIOServer | null {
  return ioInstance;
}

/**
 * Emit an event to all connected clients in an order room
 */
export function emitToOrderRoom(orderNumber: string, event: string, data: any): void {
  if (ioInstance) {
    ioInstance.to(`order:${orderNumber}`).emit(event, data);
  }
}
