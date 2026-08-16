export const TOKENS = {
  // Services
  AuthService: Symbol.for('AuthService'),
  UsersService: Symbol.for('UsersService'),
  FolderService: Symbol.for('FolderService'),
  FileService: Symbol.for('FileService'),
  StatisticsService: Symbol.for('StatisticsService'),

  // Controllers
  AuthController: Symbol.for('AuthController'),
  UsersController: Symbol.for('UsersController'),
  FolderController: Symbol.for('FolderController'),
  FileController: Symbol.for('FileController'),
  StatisticsController: Symbol.for('StatisticsController'),

  // Lib/infra/
  Logger: Symbol.for('Logger'),
  PrismaClient: Symbol.for('PrismaClient'),
  EmailProvider: Symbol.for('EmailProvider'),
};



