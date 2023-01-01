import passport from "passport"
import { Express } from "express";

declare global {
  namespace Express {
    export interface Request {
      payload?: any
    }
  }
}



export = global