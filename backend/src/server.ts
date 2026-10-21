import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createApp } from './app';
import { config } from './config';
import { prisma } from './config/database';

async function bootstrap() {
  const app = createApp();
  const server = http.createServer(app);

  // Setup Socket.io
  const io = new SocketIOServer(server, {
    cors: {
      origin: [config.frontendUrl, 'http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`⚡ WebSocket client connected: ${socket.id}`);

    // Join order room for escrow chat & live status updates
    socket.on('join_order_room', (orderId: string) => {
      socket.join(`order:${orderId}`);
      console.log(`Socket ${socket.id} joined order room: order:${orderId}`);
    });

    // Leave order room
    socket.on('leave_order_room', (orderId: string) => {
      socket.leave(`order:${orderId}`);
      console.log(`Socket ${socket.id} left order room: order:${orderId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 WebSocket client disconnected: ${socket.id}`);
    });
  });

  // Start HTTP Server
  server.listen(config.port, () => {
    console.log(`
======================================================
🎮 Game Account Marketplace Backend
======================================================
🚀 Server running on    : http://localhost:${config.port}
🔗 Health Check         : http://localhost:${config.port}/health
📡 API Base             : http://localhost:${config.port}${config.apiPrefix}
🐘 Database             : Neon Serverless PostgreSQL (Connected)
⚙️ Environment          : ${config.nodeEnv}
======================================================
    `);
  });

  // Graceful Shutdown
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
    server.close(async () => {
      console.log('HTTP and WebSocket server closed.');
      await prisma.$disconnect();
      console.log('Database connections closed.');
      process.exit(0);
    });

    // Force shutdown after 10s
    setTimeout(() => {
      console.error('Forced shutdown due to timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
