import { Router } from 'express';
import { sessionsController } from '../../instances/controllers.js';
import { checkRefreshToken } from '../middleware/check-refresh-token.js';

export const securityRouter = Router();

securityRouter.get('/devices', checkRefreshToken, sessionsController.getDevices);

securityRouter.delete('/devices', checkRefreshToken, sessionsController.deleteOtherDevices);

securityRouter.delete('/devices/:deviceId', checkRefreshToken, sessionsController.deleteDevice);
