const app = require('./app');
const config = require('./config');
const prisma = require('./prisma');

const startServer = async () => {
  try {

    await prisma.$connect();
    console.log('Database connected');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});