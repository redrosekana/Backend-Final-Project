import { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";
import ejs from "ejs";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as fs from "fs";

// model
import { userModel } from "../../schema/user.schema";

// exception
import { BadRequestException } from "../../exeptions/BadRequestException";

// interface
import { PayloadEmail } from "../../interface/payload.interface";

// enviroment variable
import {
  SECRET_EMAIL,
  PASSWORD_EMAIL,
  URL_FRONTEND,
  SALT,
} from "../../config/variable";

// utils
import { ValidateEmail } from "../../utils/validateEmail";

class ForgetPasswordController {
  public async sendEmail(req: Request, res: Response, next: NextFunction) {
    const email: string = (req.body.email as string).trim();

    if (!ValidateEmail(email)) {
      next(new BadRequestException("invalid format email"));
    } else {
      const user = await userModel.findOne({ email: { $eq: email } });
      if (!user) {
        next(new BadRequestException("there is no email in the system"));
      } else {
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          secure: false,
          requireTLS: true,
          auth: {
            user: "sukachathum.s@ku.th",
            pass: PASSWORD_EMAIL,
          },
          logger: true,
        });
        const payload: PayloadEmail = { email: email };
        const token = jwt.sign(payload, SECRET_EMAIL, {
          expiresIn: "300000ms",
        });
        const contentHTML: string = ejs.render(
          fs.readFileSync("./views/index.ejs", "utf8"),
          {
            link: `<a class='btn' href='${URL_FRONTEND}?token=${token}'>ยืนยันตัวตน</a>`,
          }
        );
        const emailDetail = {
          from: '"Boardgame recCommu" <sukachathum.s@ku.th>',
          to: `'User' <${email}>`,
          subject: "Reset Password",
          date: new Date(),
          html: contentHTML,
        };

        transporter.sendMail(emailDetail, (error) => {
          if (error) {
            next(error);
          } else {
            res.status(200).json({
              statusCode: 200,
              message: "successfully send email",
            });
          }
        });
      }
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const token = (req.body.token as string).trim();
      const password_new = (req.body.password_new as string).trim();
      const payload = jwt.verify(token, SECRET_EMAIL);
      const salt = await bcrypt.genSalt(SALT);
      const passwordEncrypt = await bcrypt.hash(password_new, salt);
      await userModel.findOneAndUpdate(
        {
          email: { $eq: (payload as { email: string }).email },
        },
        {
          $set: {
            password: passwordEncrypt,
          },
        }
      );

      res.status(201).json({
        statusCode: 201,
        message: "successfully reset password",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
export default ForgetPasswordController;
