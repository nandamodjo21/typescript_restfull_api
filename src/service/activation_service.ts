
import conn from "../config/db";
import {ResponseError} from "../error/response_error";

export class Activation_service {
    static async activate(email:string): Promise<void> {
        if (!email) {
            throw new ResponseError(400, "Invalid email parameter");
        }
        const query = `UPDATE users SET active = 'ACTIVE' WHERE email = ?`;
        const [result] = await conn.promise().query(query, [email]) as unknown as [import('mysql2').ResultSetHeader];

        if (result.affectedRows === 0) {
            throw new ResponseError(404, "User not found or already active");
        }
    }
}