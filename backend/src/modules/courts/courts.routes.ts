import { Router } from 'express';
import { createCourtController, getCourtAvailabilityController, getCourtController, listAdminCourtsController, listCourtsController, updateCourtController } from './courts.controller.js';
import { validateQuery } from '../../middlewares/validate-query.js';
import { courtAvailabilityQuerySchema, courtParamsSchema, createCourtBodySchema, listAdminCourtsQuerySchema, listCourtsQuerySchema, updateCourtBodySchema } from './courts.schema.js';
import { validateParams } from '../../middlewares/validate-params.js';
import { validateBody } from '../../middlewares/validate-body.js';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';

export const courtsRouter = Router();

courtsRouter.get('/', validateQuery(listCourtsQuerySchema), listCourtsController);
courtsRouter.get('/:courtId', validateParams(courtParamsSchema), getCourtController);
courtsRouter.get('/:courtId/availability', validateParams(courtParamsSchema), validateQuery(courtAvailabilityQuerySchema), getCourtAvailabilityController);

export const adminCourtsRouter = Router();

adminCourtsRouter.use(authenticate, authorize('ADMIN'));
adminCourtsRouter.get('/', validateQuery(listAdminCourtsQuerySchema), listAdminCourtsController);
adminCourtsRouter.post('/', validateBody(createCourtBodySchema), createCourtController);
adminCourtsRouter.patch('/:courtId', validateParams(courtParamsSchema), validateBody(updateCourtBodySchema), updateCourtController);
