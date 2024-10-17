import connection from "../config/db";
import { toUserResponse, User } from "../models/user";

export class UserService {
  static async users(): Promise<User[]> {
    const sql = "SELECT * FROM users";
    const [rows] = await connection.promise().query(sql);
    const result = rows as any[]; // Casting hasil query ke array
    console.log("Query Result:", result); // Cek hasil query
    return result.map((user) => toUserResponse(user));
  }
}
