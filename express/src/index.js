const express = require("express")
const logger = require("./middlewares/logger")
const router = require("./router/router")
const sass = require('node-sass-middleware');
const handlebars = require("express-handlebars");
const cookieParser = require("cookie-parser")
const uuid = require("uuid")
const session = require("express-session")


require("dotenv").config()

const app = express()
//const PORT = process.env.PORT 
const PORT = 4455; 
app.use(express.urlencoded({extended: false}));
app.use(logger("complete"))
app.use(cookieParser())

app.use(session({
    genid: ()=> uuid.v4(),
    secret: "Sm$dJS45Mda@g",
    resave: true,
    cookie:{
        maxAge: 2 * 60 * 60 * 1000,
    },
    saveUninitialized: true
}))

app.use((req,res,next)=>{
    app.locals.logado = !!req.session.uid;
    next()
})

app.engine("handlebars", handlebars.engine({
    helpers: require(`${__dirname}/views/helpers/helpers.js`)
}));
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use(sass({
src: `${__dirname}/../public/scss`,
dest: `${__dirname}/../public/css`,
outputStyle: "compressed",
prefix: "/css",
}));

app.use("/img", express.static(`${__dirname}/../public/img`))
app.use("/css", express.static(`${__dirname}/../public/css`));
app.use("/webfonts", express.static(`${__dirname}/node_modules/@fortawesome/fontawesome-free/webfonts`));
app.use('/js', [
express.static(`${__dirname}/../public/js`),
express.static(`${__dirname}/../node_modules/bootstrap/dist/js/`)
]);

app.use(router)

app.listen(PORT,()=>{
    console.log(`Express app iniciada na porta ${PORT}`);
})
