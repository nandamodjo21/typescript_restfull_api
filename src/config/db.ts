import mysql, { ConnectionOptions } from "mysql2";

const access: ConnectionOptions = {
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const conn = mysql.createConnection(access);
export default conn;
