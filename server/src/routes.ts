import { Router } from 'express';
import { healthRouter } from './app/health/health.routes';
import { authRouter } from './app/auth/routes';
import { usersRouter } from './app/users/routes';
import { filesRouter, foldersRouter } from './app/files/routes';
import { statisticsRouter } from './app/statistics/routes';

export const routes = Router();

routes.use('/health', healthRouter);
routes.use('/auth', authRouter);
routes.use('/users', usersRouter);
routes.use('/folders', foldersRouter);
routes.use('/files', filesRouter);
routes.use('/statistics', statisticsRouter);
