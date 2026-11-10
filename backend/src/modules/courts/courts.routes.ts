import { Router } from 'express';
import { listCourtsController } from './courts.controller.js';
import { validateQuery } from '../../middlewares/validate-query.js';
import { listCourtsQuerySchema } from './courts.schema.js';

export const courtsRouter = Router();

courtsRouter.get('/', validateQuery(listCourtsQuerySchema), listCourtsController);
