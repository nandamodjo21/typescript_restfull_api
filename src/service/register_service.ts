import { RegisterRequest } from "../models/register";
import { Validation } from "../validation/validation";
import { AuthValidation } from "../validation/auth_validation";
import conn from "../config/db";
import { ResponseError } from "../error/response_error";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import dotEnv from "dotenv";
import {transporter} from "../config/email";
import {sock, startBot} from "../utils/star_sock";
import {generateWAMessageFromContent, proto} from "@whiskeysockets/baileys";
dotEnv.config();
export class RegisterService {
    static async register(req: RegisterRequest): Promise<void> {
        // Validasi data menggunakan Zod
        const registerReq = Validation.validate(AuthValidation.REGISTER, req);
        console.log(registerReq.username);
        // Cek apakah username atau email sudah ada di database
        const [rows] = await conn.promise().query(
            `SELECT * FROM users WHERE username= ? OR email = ?`,
            [registerReq.username, registerReq.email]
        );
        const existingUser = rows as any[];
        if (existingUser.length > 0) {
            throw new ResponseError(400, "Username or email already exists");
        }

        // Hash password
        const hashPass = await bcrypt.hash(registerReq.password, 10);
        const number = registerReq.whatsapp + '@s.whatsapp.net';
        // Masukkan user baru ke dalam database
        const query = `INSERT INTO users(kd_user, name, username, email,nomor_whatsapp, password) VALUES (?, ?, ?, ?, ?, ?)`;
        await conn.promise().query(query, [
            uuidv4(),
            registerReq.name,
            registerReq.username,
            registerReq.email,
            number,
            hashPass
        ]);
        if (registerReq.whatsapp != null){
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
         await sendOtpToWhatsApp(number,otpCode);
        }
        const mailOptions = {
            from: process.env.EMAIL_USER, // Email pengirim
            to: registerReq.email, // Email user yang didaftarkan
            subject: 'User Activation', // Subjek email
            html: `
                <h1>Activate Your Account</h1>
                <p>Hello ${registerReq.name},</p>
                <p>Thank you for registering. Please,<a href="http://localhost:5353/activation?email=${registerReq.email}">Click Here</a> below to activate your account:</p>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (!error) {
                console.log(`Activation email sent: ${info.response}`);
            } else {
                console.error(`Error sending email: ${error}`);
                throw new ResponseError(500, "Failed to send activation email");
            }
        });

    }

}
async function sendOtpToWhatsApp(jid: string, otpCode: string) {
    // console.log(jid + otpCode);
    // const otpCodeInt = parseInt(otpCode, 10);
    // const message = `Your OTP code is: ${otpCodeInt}. Please use this code to complete your registration.`;
    // sock.sendMessage(jid, {text: message});



}

