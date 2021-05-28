var { Pool } = require("pg")

module.exports = new Pool({
    user:"postgres",
    password:"marcos89",
    host: "localhost",
    port: 5432,
    database: "my_teacher"
})