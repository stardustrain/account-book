const env = require('dotenv').config({
  path: './.env',
}).parsed

module.exports = {
  type: 'postgres',
  host: env.TYPEORM_HOST,
  port: env.TYPEORM_PORT,
  database: env.TYPEORM_DATABASE,
  username: env.TYPEORM_USERNAME,
  password: env.TYPEORM_PASSWORD,
  entities: ['src/**/*.entity.ts'],
  cli: {
    migrationsDir: 'src/migrations',
  },
}
