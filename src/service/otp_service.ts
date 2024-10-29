import {ResponseError} from "../error/response_error";
import conn from "../config/db";

export class Otp_service{
    static async otp(token:string,whatsapp:string):Promise<void>{
        if (!token){
            throw new ResponseError(404,'Otp not found')
        }

       try {
           const [rows] = await conn.promise().query("SELECT * FROM tb_token where token = ?",[token]);
           const [users] = await conn.promise().query("SELECT * FROM users WHERE nomor_whatsapp = ?",[whatsapp]);
           const  result = rows as any[];
           const resUser = users as any[];
           console.log(resUser);
           if (result.length > 0){
               const tokenData = result[0];
               const currentDateTime  = new Date();

               if (currentDateTime > tokenData.expired_date){
                   throw new ResponseError(400,'token expired');
               }
               if (result.length == 0){
                   throw new ResponseError(404,'user not found');
               }
               const user = resUser[0];
               // console.log(user);
               const isActive = user.active;
               console.log(isActive)
               if (isActive ==='ACTIVE'){
                   throw new ResponseError(401,`user has been activated`);
               }
               const query = `UPDATE users SET active = 'ACTIVE' WHERE nomor_whatsapp = ?`;
               const [data] = await conn.promise().query(query, [whatsapp]) as unknown as [import('mysql2').ResultSetHeader];

               if (data.affectedRows === 0){
                   throw new ResponseError(404, "User not found or already active");
               }
           }
       }catch (e) {
            throw new ResponseError(400, `${e}`);
       }
    }
}