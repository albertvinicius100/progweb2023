const models = require("../models/index")
const Curso = models.Curso;
const Op = models.Sequelize.Op;

const index = async(req, res) =>{
    const cursos = await Curso.findAll();
    res.render("curso/index", {
        cursos : cursos.map(curso => curso.toJSON())
    })
}

const create = async(req, res) =>{
    if(req.route.methods.get){
        res.render("curso/create")
    }else{
        try{
            await Curso.create(req.body)
            res.redirect("/curso")
        }catch(err){
            throw new Error(err)
        }
        
    }
    
}

const read = async(req, res) =>{
    const  id  = req.params.id;
    const curso = await Curso.findOne({ where: {id }, include: models.Area });
    res.render("curso/read", { 
        curso: curso.toJSON()
    })
}
const update = async(req, res) =>{
    const  id  = req.params.id;
    const curso = await Curso.findOne({ where: {id }, include: models.Area });
    if(req.route.methods.get){
        res.render("curso/create",{
            
        })
    }else{
        try{
            await Curso.create(req.body)
            res.redirect("/curso")
        }catch(err){
            throw new Error(err)
        }
        
    }
}
const remove = async(req, res) =>{}

module.exports = {index, create, read, update, remove}