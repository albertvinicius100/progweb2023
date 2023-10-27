const models = require("../models")
const Curso = models.Curso;
const index = (req, res)=> {
    const profes = [
    { nome: 'David Fernandes', sala: 1238 },
    { nome: 'Horácio Fernandes', sala: 1233 },
    { nome: 'Edleno Moura', sala: 1236 },
    { nome: 'Elaine Harada', sala: 1231 }
    ];
    res.render('main/index', { profes});
    };


const sobre = (req, res) => {
    const conteudo = 'Página sobre a aplicação';
    res.render('main/sobre', {
        conteudo,
    });
};


const auth = (req, res) =>{
    if(!('usuario' in req.cookies)){
        res.cookie('usuario', 3452)
        res.send('Usuário identificado')
    }else{
        res.send('Usuário já inha sido identificado')
    }
}




const signup = async (req,res) => {
    if (req.route.methods.get){
        const cursos = await Curso.findAll();
        res.render("main/signup",{
            cursos: cursos.map(curso => curso.toJSON())
        })
    }else{
        bcrypt.genSalt(parseInt(process.env.ROUNDS),
        bcrypt.hash(req.body.senha, salt, async(err, hash)=>{
            await User.create({
            nome: req.body.nome,
            email: req.body.email,
            senha: hash,
            cursoId: req.body.cursoId
            });
            res.redirect("/");
        }))
    }
}
const login = async (req,res) => {
    const users = await User.findOne({where:{email:req.body.email}});
    if (user) {
        bcrypt.compare(req.body.senha, user.senha, (err, ok) => {
    if (ok) {
        req.session.uid = user.id;
        res.redirect('/');
    } else {
        res.render('main/login', {
        csrf: req.csrfToken()
        });
        }
    });
}
}
const logout = (req,res) => {}

module.exports = {index, sobre, signup, login, logout, auth}