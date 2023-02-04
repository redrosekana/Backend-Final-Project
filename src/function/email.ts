//* import library
import { Request, Response  } from "express";
import nodemailer from "nodemailer"
import ejs from "ejs"
import * as jwt from "jsonwebtoken"
import * as fs from "fs"

//* import model
import User_member from "../model/user-member";

//* function check valid email
function ValidateEmail(email:string) {
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
    return (true)
  }else {
    return (false)
  }
}

async function Email(req:Request , res:Response) {

    const password_email:string = process.env.PASSWORD_EMAIL as string
    const secret_waitemail:string = process.env.SECRET_WAITEMAIL as string
    const url_frontend:string = process.env.URL_FRONTEND as string

    const {email} = req.body
    
    if (!email) {
        res.status(400).json({
            "message":"require a user email"
        })
    }else if (!ValidateEmail(email as string)) {
        res.status(400).json({
            "message":"invalid email format"
        })
    }else {
        try {
            const result = await User_member.findOne({"email":{$eq:email}})
            
            if (!result) {
                res.status(400).json({
                    "message":"don't exist a user email in the database"
                })
            }else {
                const transporter = nodemailer.createTransport({
                    service:"Gmail",
                    secure: false,
                    requireTLS: true,
                    auth: {
                        user: "sukachathum.s@ku.th",
                        pass: password_email,
                    },
                    logger: true
                });
    
                const payload = {"email":email}

                const token = jwt.sign(payload,secret_waitemail,{
                    algorithm:"HS256",
                    expiresIn:"300000ms"
                })
                const htmlString:string = ejs.render(fs.readFileSync('./views/index.ejs', 'utf8'),{
                    "link":`<a class='btn' href='${url_frontend}?token=${token}'>ยืนยันตัวตน</a>`
                })
                
                const info = {
                    from: '"Sukachathum" <sukachathum.s@ku.th>',
                    to: `'Customer' <${email}>`,
                    subject: "Reset Password",
                    date:new Date(),
                    html: htmlString,
                }
            
                transporter.sendMail(info,(err,result) => {
                    if (err) {
                        res.status(500).json({
                            "message":"occur error make to can't send email"
                        })
                    }else {
                        console.log(result)
                        res.status(200).json({
                            "message":"send email success"
                        })
                    }
                })
            }
        }catch(err) {
            res.status(500).json({
                "message":"occur error in server"
            })
        }
    }
}

export default Email