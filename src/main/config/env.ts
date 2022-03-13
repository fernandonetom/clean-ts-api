export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://192.168.1.180:27017/clean-node-api',
  port: process.env.PORT ?? 3000,
  jwtSecret: process.env.JWT_SECRET ?? 'secreeet'
}
