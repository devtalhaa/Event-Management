import { env } from './config/env';
import { connectDB } from './config/db';
import app from './app';

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });
};

startServer();
