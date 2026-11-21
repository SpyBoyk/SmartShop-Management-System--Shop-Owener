import { createServer } from 'vite';

async function start() {
  const server = await createServer({
    configFile: './vite.config.ts',
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      cors: true,
    },
  });
  await server.listen();
  console.log('=== VITE PROGRAMMATIC SERVER READY ===');
  server.printUrls();

  // Prevent process from exiting
  setInterval(() => {}, 60000);
}

start().catch((err) => {
  console.error('Failed to start Vite server:', err);
  process.exit(1);
});

