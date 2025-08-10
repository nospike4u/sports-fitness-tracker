import { Router } from "express";
import { param, query } from "express-validator";

import {
  getAllUsers,
  getSingleUser,
  createSingleUser,
  deleteSingleUser,
  updateSingleUser
//   registerUser,
//   loginUser
} from "../../controller/users/usersController.js";

const usersRouter = Router();

const valid = [
  // param('id').isInt({min: 1}).withMessage('ID must be a number'),
  // query('page').isInt({min: 1}).withMessage('Page number must be a positive integer'),
  // query('size').isInt({max: 1}).withMessage('Size must be a positive interger'),
];

usersRouter.get(`/`, valid, getAllUsers);
usersRouter.post(`/`, valid, createSingleUser 
// registerUser, loginUser
);

usersRouter.get(`/:id`, valid, getSingleUser);
usersRouter.put(`/:id`, valid, updateSingleUser);
usersRouter.delete(`/:id`, valid, deleteSingleUser);

export default usersRouter;
