import { toUserResponse, User } from "../models/user";
import conn from "../config/db";

export class UserService {
  static async users(): Promise<User[]> {
    const sql = "SELECT * FROM users";
    const [rows] = await conn.promise().query(sql);
    const result = rows as any[]; // Casting hasil query ke array
    console.log("Query Result:", result); // Cek hasil query
    return result.map((user) => toUserResponse(user));
  }
}
