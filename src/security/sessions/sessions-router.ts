import { Router } from 'express';
import { authController, sessionsController } from '../../instances/controllers.js';

export const securityRouter = Router();

securityRouter.get('/devices', authController.refreshToken, sessionsController.getDevices);

securityRouter.delete('/devices', authController.refreshToken, sessionsController.deleteOtherDevices);

securityRouter.delete('/devices/:deviceId', authController.refreshToken, sessionsController.deleteDevice);
