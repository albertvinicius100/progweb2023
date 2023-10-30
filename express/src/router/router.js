const express = require("express")
const router = express.Router()
const mainController = require("../controllers/main.js")
const areaController = require("../controllers/area.js")
const cursoController = require("../controllers/curso.js")

//router.get("/bemvindo/:nome/:sobrenome", (req,res)=>{
//    res.send(`Seja bem-vindo ${req.params.nome}`)
//})


//Main Controller
router.get("/", mainController.index)
router.get("/sobre", mainController.sobre)
router.get("/auth", mainController.auth)
router.get("/signup", mainController.signup)
router.post("/signup", mainController.signup)
router.get("/login", mainController.login)
router.post("/login", mainController.login)
router.get("/logout", mainController.logout)

//Area Controller

router.get("/area", areaController.index);

//Curso Controller

router.get("/curso", cursoController.index);
router.get("/curso/create", cursoController.create);
router.post("/curso/create", cursoController.create);
router.get("/curso/update/:id", cursoController.update);
router.post("/curso/update/:id", cursoController.update);
router.get("/curso/read/:id", cursoController.read);
router.get("/curso/remove", cursoController.remove);


module.exports = router;
