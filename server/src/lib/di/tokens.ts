export const TOKENS = {
  // Services
  AuthService: Symbol.for('AuthService'),
  UsersService: Symbol.for('UsersService'),

  // Controllers
  AuthController: Symbol.for('AuthController'),
  UsersController: Symbol.for('UsersController'),

  // Lib/infra/
  Logger: Symbol.for('Logger'),
  PrismaClient: Symbol.for('PrismaClient'),
  EmailProvider: Symbol.for('EmailProvider'),
};



