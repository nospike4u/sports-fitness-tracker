import { Router } from "express";
import { param, query } from "express-validator";

import {
 getAllStats,
 getSingleStat,
 updateSingleStat,
 deleteSingleStat,
 createSingleStat

} from "../controller/healthStatsController.js";

const healthStatsRouter = Router();

const valid = [
  param('id').isInt({min: 1}).withMessage('ID must be a number'),
  query('page').isInt({min: 1}).withMessage('Page number must be a positive integer'),
  query('size').isInt({max: 1}).withMessage('Size must be a positive interger'),
];

healthStatsRouter.get(`/`, valid, getAllStats);
healthStatsRouter.post(`/`, valid, createSingleStat 
);

healthStatsRouter.get(`/:id`, valid, getSingleStat);
healthStatsRouter.put(`/:id`, valid, updateSingleStat);
healthStatsRouter.delete(`/:id`, valid, deleteSingleStat);

export default healthStatsRouter;
