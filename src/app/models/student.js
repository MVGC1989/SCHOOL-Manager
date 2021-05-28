var {date} = require('../../lib/utils')
var db = require('../../config/db')

module.exports = {
    all(callback){ //será resposável por chamar  todos os instrutores index
        db.query(`SELECT * FROM students`, function(err , results){
            if(err){ throw `Database Error ! ${err}`}
                callback(results.rows)
    })    
    },

    create( data, callback){
        var query =  `
            INSERT INTO students (
                avatar_url,
                name,
                birth,
                email,
                school_year,
                weekly_workload,
                teacher_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
        `
        var values = /*essa var terá os valores que substituiram os valores em $1 etc*/[
            data.avatar_url,
            data.name,
            date(data.birth).iso,//vai puxar do ultils a forma de data dia mes ano
            data.email,
            data.school_year,
            data.weekly_workload,
            data.teacher
        ]
        
        db.query(query, values, function(err , results){
            if(err){ throw `Database Error ! ${err}`}
                callback(results.rows[0])
        })
    },

    find(id , callback){//esa função vai buscar um instrutor apenas, página show
        db.query(`
            SELECT students.*, teachers.name AS teacher_name
            FROM students 
            LEFT JOIN teachers ON (students.teacher_id = teachers.id)
            WHERE students.id = $1`, [id], function(err , results){
                if(err){ throw `Database Error ! ${err}`}
                    callback(results.rows[0])
        })
    },

    update(data , callback){
        var query = `
            UPDATE students SET
                avatar_url = ($1),
                name = ($2),
                birth = ($3),
                email = ($4),
                school_year = ($5),
                weekly_workload = ($6),
                teacher_id = ($7)
            WHERE id = $8
        `
        var values = [
            data.avatar_url,
            data.name,
            date(data.birth).iso,//vai puxar do ultils a forma de data dia mes ano
            data.email,
            data.school_year,
            data.weekly_workload,
            data.teacher,
            data.id
        ]

        db.query(query, values, function (err , results){
            if(err){ throw `Database Error! ${err}`}
                callback()
        })
    },

    delete(id , callback){
        db.query(`DELETE FROM students WHERE id = $1`, [id], function(err , results){
            if(err){ throw `Database Error ! ${err}`}
            return callback()
        })
    },

    teachers_select_options(callback){//aqui vou selecionar o nome dos instrutores para escolher no campo de preenchimento do novo aluno
        db.query(`SELECT name, id FROM teachers`, function(err , results){
            if(err){ throw `Database error! ${err}`}
                callback(results.rows)
        })
    },

    paginate(params){
        var { filter, limit, offset, callback } = params

        let query = ""
        let filter_query = ""
        let total_query = `(
            SELECT count(*) FROM students
        ) AS total` 
        
        if (filter) { 

            filter_query = `
            WHERE students.name ILIKE '%${filter}%'
            OR students.email ILIKE '%${filter}%'
            `

            total_query = `(
                SELECT count(*) FROM students
                ${filter_query}
            ) AS total`
        }

        query = `
        SELECT students.*, ${total_query}
        FROM students
        ${filter_query}
        LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], function(err , results){
            if(err){ throw `Database Error! ${err}`}

            callback(results.rows)
        })
    }
} 