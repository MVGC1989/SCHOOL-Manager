var {date} = require('../../lib/utils')
var Student = require('../models/student')

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
            callback(students){
                const pagination = { 
                    total: Math.ceil(students[0].total / limit), 
                    page
                }
                    return res.render("students/index" , {students , pagination , filter})
        }
    }
        Student.paginate(params)
    },
    
    create(req , res){
        Student.teachers_select_options(function(options){
            return res.render('students/create' , {teacher_options: options})
        })
    },

    post(req , res){

        var keys = Object.keys(req.body) 
        for( key of keys){
            if(req.body[key]== ""){
                return res.send("Por favor, preencha todos os campos!")
            }
        }
        Student.create(req.body, function(student){
            return res.redirect(`/students/${student.id}`)
        })
    },

    show(req , res){
        Student.find(req.params.id, function(student){
            if(!student){ return res.send('Estudante não encontrado!')}
                student.birth = date(student.birth).birth_day            
                    return res.render("students/show", {student})
        })
    },
    
    edit(req , res){
        Student.find(req.params.id, function(student){
            if(!student){ return res.send('Estudante não encontrado!')}
            
                student.birth = date(student.birth).iso
                Student.teachers_select_options(function(options){
                    return res.render('students/edit', {student , teacher_options:options})
                })  
        })

    },

    put(req , res){
        var keys = Object.keys(req.body) 
            for( key of keys){
                if(req.body[key]== ""){
                    return res.send("Por favor, preencha todos os campos!")
            }
        }

        Student.update(req.body, function(){
            return res.redirect(`/students/${req.body.id}`)
        })

    },

    delete(req , res){
        Student.delete(req.body.id, function(){
            return res.redirect(`/students`)
        })

    },
}
