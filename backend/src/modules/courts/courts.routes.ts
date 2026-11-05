import { Router } from 'express';
import type { PrismaClient } from '../../generated/prisma/client.js';
import { createCourtsController } from './courts.controller.js';
import { createCourtsService } from './courts.service.js';
import { validateListCourts } from './courts.validation.js';

export function createCourtsRouter(database: PrismaClient) {
  const router = Router();
  const service = createCourtsService(database);
  const controller = createCourtsController(service);

  router.get('/', validateListCourts, controller.listCourts);
  return router;
}
