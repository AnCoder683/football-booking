import { Router } from 'express';
import { listBranchesController } from './branches.controller.js';

export const branchesRouter = Router();

branchesRouter.get('/', listBranchesController);
