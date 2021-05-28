var {age , date} = require('../../lib/utils')
var Teacher = require('../models/teacher')


module.exports = {
    index(req , res){
            let { filter, page, limit} = req.query 
        
            page = page || 1 
            limit = limit || 2
            let offset = limit * (page -1)
        
            var params = {
            filter,
            page,
            limit,
            offset,
            callback(teachers){

            const pagination = { 
                total: Math.ceil(teachers[0].total / limit), 
                page
                }
                    return res.render("teachers/index" , {teachers , pagination , filter})
            }  
    }
        Teacher.paginate(params)
},  

    create(req , res){
        return res.render('teachers/create')
    },

    post(req , res){
        var keys = Object.keys(req.body) 
            for( key of keys){
                if(req.body[key]== ""){
                    return res.send("Por favor, preencha todos os campos!")
            }
        }
        Teacher.create(req.body, function(teacher){
            return res.redirect(`/teachers/${teacher.id}`)
        })
    },

    show(req , res){
        Teacher.find(req.params.id, function(teacher){
            if(!teacher){ 
                    return res.send('Professor não encontrado!')
            }
                teacher.age = age(teacher.birth_date)
                teacher.subjects_taught = teacher.subjects_taught.split(",")
                teacher.created_at = date(teacher.created_at).format
                    return res.render("teachers/show", {teacher})
        })
    },
    
    edit(req , res){
        Teacher.find(req.params.id, function(teacher){
            if(!teacher){ 
                return res.send('Professor não encontrado!')
            }
                teacher.birth_date = date(teacher.birth_date).iso
                    return res.render("teachers/edit", {teacher})
        })
    },

    put(req , res){
        var keys = Object.keys(req.body) 
            for( key of keys){
                if(req.body[key]== ""){
                    return res.send("Por favor, preencha todos os campos!")
            }
        }

        Teacher.update(req.body, function(){
            return res.redirect(`/teachers/${req.body.id}`)
        })

    },

    delete(req , res){
        Teacher.delete(req.body.id, function(){
            return res.redirect(`/teachers`)
        })

    },
}
