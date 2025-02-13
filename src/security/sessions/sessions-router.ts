import { Router } from 'express';
import { sessionsController } from '../../instances/controllers.js';
import { checkRefreshToken } from '../middleware/check-refresh-token.js';
import { checkSession } from '../middleware/check-session.js';

export const securityRouter = Router();

securityRouter.get('/devices', checkRefreshToken, checkSession, sessionsController.getDevices);

securityRouter.delete('/devices', checkRefreshToken, checkSession, sessionsController.deleteOtherDevices);

securityRouter.delete('/devices/:deviceId', checkRefreshToken, checkSession, sessionsController.deleteDevice);
