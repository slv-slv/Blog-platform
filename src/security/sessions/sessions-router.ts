import { Router } from 'express';
import { checkRefreshToken } from '../middleware/check-refresh-token.js';
import { checkSession } from '../middleware/check-session.js';
import { container } from '../../ioc/container.js';
import { SessionsController } from './sessions-controller.js';

export const securityRouter = Router();
const sessionsController = container.get(SessionsController);

securityRouter.get('/devices', checkRefreshToken, checkSession, sessionsController.getDevices);

securityRouter.delete('/devices', checkRefreshToken, checkSession, sessionsController.deleteOtherDevices);

securityRouter.delete('/devices/:deviceId', checkRefreshToken, checkSession, sessionsController.deleteDevice);
