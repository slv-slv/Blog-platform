import { Router } from 'express';
import { authController, securityController } from '../instances/controllers.js';

export const securityRouter = Router();

securityRouter.get('/devices', authController.verifyRefreshJwt, securityController.getDevices);

securityRouter.delete('/devices', authController.verifyRefreshJwt, securityController.deleteOtherDevices);

securityRouter.delete('/devices/:deviceId', authController.verifyRefreshJwt, securityController.deleteDevice);
