import { Express } from "express"
declare global {
  namespace Express {
    export interface Request {
      payload?: any,
      user?: any,
    }
  }
}

export = global


