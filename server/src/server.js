

require("dotenv").config();
const app = require("./app");
const pool = require("./config/db");
const port = process.env.PORT || 5000;

(async () => {
    try {
       await pool.query("SELECT 1");
       console.log(`DB → ${process.env.DB_DATABASE}`);


        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
        
    } catch (error) {
        console.error("PostgreSQL Connection Error:", error);
        process.exit(1);
        }
})();

