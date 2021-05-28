var express = require("express")
var routes = express.Router()
var teachers = require("./app/controllers/teachers")
var students = require("./app/controllers/students")

//Rotas Teachers
routes.get("/", function( req , res ){
    return res.redirect("/teachers")
})
routes.get("/teachers", teachers.index)
routes.get("/teachers/create", teachers.create)
routes.get("/teachers/:id", teachers.show)//rota exibição do professor cadastrado
routes.get("/teachers/:id/edit", teachers.edit)//rota para página de edição do prof cadastrado
routes.post('/teachers', teachers.post)//rota do formulário
routes.put("/teachers", teachers.put)//rota atualização de professor
routes.delete("/teachers", teachers.delete)//rota para deletar o professor

//Rotas Students
routes.get("/students", students.index)
routes.get("/students/create", students.create)
routes.get("/students/:id", students.show)
routes.get("/students/:id/edit", students.edit)
routes.post('/students', students.post)
routes.put("/students", students.put)
routes.delete("/students", students.delete)

module.exports = routes