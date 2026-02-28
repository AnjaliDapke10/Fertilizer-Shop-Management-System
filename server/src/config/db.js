const { Pool } = require ('pg');
const pool = new Pool({
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    user : process.env.DB_USER, 
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    options: "-c search_path=public",
});

pool.on('connect',()=>{
    console.log("PostgreSQl Connected");
});

pool.on('error',(err)=>{
    console.error('PostgreSQL Error',err);
    process.exit(1);
})



module.exports = pool;