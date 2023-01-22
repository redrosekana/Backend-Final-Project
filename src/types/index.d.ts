import { Express } from "express";

declare global {
  namespace Express {
    export interface Request {
      payload?: any,
      proflie?: any,
    }
  }
}



export = global