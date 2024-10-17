import { RegisterRequest } from "../models/register";
import { Validation } from "../validation/validation";
import { AuthValidation } from "../validation/auth_validation";
import conn from "../config/db";
import { ResponseError } from "../error/response_error";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

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

        // Masukkan user baru ke dalam database
        const query = `INSERT INTO users(kd_user, name, username, email, password) VALUES (?, ?, ?, ?, ?)`;
        await conn.promise().query(query, [
            uuidv4(),
            registerReq.name,
            registerReq.username,
            registerReq.email,
            hashPass
        ]);
    }
}
