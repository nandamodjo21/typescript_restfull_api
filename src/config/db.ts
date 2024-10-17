import mysql, { ConnectionOptions } from "mysql2";
import dotEnv from "dotenv";
dotEnv.config();
const access: ConnectionOptions = {
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
};

const conn = mysql.createConnection(access);
export default conn;
