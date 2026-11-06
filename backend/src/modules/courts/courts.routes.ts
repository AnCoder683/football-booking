import { Router } from 'express';
import { listCourtsController } from './courts.controller.js';
import { validateListCourts } from './courts.validation.js';

export const courtsRouter = Router();

courtsRouter.get('/', validateListCourts, listCourtsController);
