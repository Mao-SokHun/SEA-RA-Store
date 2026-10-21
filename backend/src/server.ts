import http from 'http';
import { createApp } from './app';
import { config } from './config';
import { prisma } from './config/database';
import { initSocketServer } from './common/socket/socketManager';

async function bootstrap() {
  const app = createApp();
  const server = http.createServer(app);

  // Initialize Socket.IO with JWT Authentication & Order Rooms
  initSocketServer(server);

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
