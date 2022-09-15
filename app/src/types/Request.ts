import { Request as ExpressRequest } from "express";
import UserModel from "../api/users/user.model";

interface Request extends ExpressRequest {
  user?: UserModel
}

export default Request;
