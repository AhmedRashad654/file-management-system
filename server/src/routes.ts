import { Router } from 'express';
import { healthRouter } from './app/health/health.routes.js';
import { authRouter } from './app/auth/routes.js';
import { usersRouter } from './app/users/routes.js';
import { filesRouter, foldersRouter } from './app/files/routes.js';
import { statisticsRouter } from './app/statistics/routes.js';

export const routes = Router();

routes.use('/health', healthRouter);
routes.use('/auth', authRouter);
routes.use('/users', usersRouter);
routes.use('/folders', foldersRouter);
routes.use('/files', filesRouter);
routes.use('/statistics', statisticsRouter);
