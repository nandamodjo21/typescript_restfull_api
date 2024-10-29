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
import {ulid} from "ulid";
dotEnv.config();
export class RegisterService {
    static async register(req: RegisterRequest): Promise<void> {
        // Validasi data menggunakan Zod
        const registerReq = Validation.validate(AuthValidation.REGISTER, req);
        try {
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
            const insertToken = `INSERT INTO tb_token(kd_token, token,expired_date) VALUES (?, ?,?)`;
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
                const expireDate = new Date(Date.now() + 5 * 60 *1000);
                await conn.promise().query(insertToken,[
                    uuidv4(),
                    otpCode,
                    expireDate
                ])
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

        }catch (e) {
         throw new ResponseError(500,`${e}`);
        }
    }

}
async function sendOtpToWhatsApp(jid: string, otpCode: string) {
    const button = [
        {
            name: "cta_copy",
            buttonParamsJson: JSON.stringify({
                display_text: "copy",
                id: "id2",
                copy_code: otpCode,
            }),
        },
    ];

    const intractiveMessage = {
        viewOnceMessage: {
            message: {
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: `*${otpCode}* adalah kode verifikasi Anda. Demi keamanan, jangan bagikan kode ini.`,
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: "kode ini kedaluwarsa dalam 5 menit.",
                    }),
                    nativeFlowMessage:
                        proto.Message.InteractiveMessage.NativeFlowMessage.create({
                            buttons: button,
                            messageParamsJson: JSON.stringify({
                                from: "api",
                                templateId: ulid(Date.now()),
                            }),
                        }),
                }),
            },
        },
    };
    const msg = generateWAMessageFromContent(jid, intractiveMessage, {
        userJid: sock.user.id,
    });

    try {
        await sock.relayMessage(jid, msg.message, {
            messageId: msg.key.id,
        });
        console.log("Pesan balasan dengan tombol berhasil dikirim");
    } catch (error) {
        console.error("Gagal mengirim pesan balasan:", error);
    }

    // console.log(jid + otpCode);
    // const otpCodeInt = parseInt(otpCode, 10);
    // const message = `Your OTP code is: ${otpCodeInt}. Please use this code to complete your registration.`;
    // sock.sendMessage(jid, {text: message});



}

