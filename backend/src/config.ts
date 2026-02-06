export const config = {
  port: parseInt(process.env.PORT || '3001'),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  s3: {
    region: process.env.S3_REGION || 'us-east-1',
    bucket: process.env.S3_BUCKET || 'movies-uploads',
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },

  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost/movies_db',
  },
};
