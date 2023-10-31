function logger(type){{
    if(type==="complete"){
        return (req, res, next)=>{
            const date = new Date;
            console.log(`${date} ${req.url}`)
            next();
        }
    }if (type=== tiny){
        return (req, res, next)=>{
            const date = new Date;
            console.log(`${date} ${req.url}`)
            next();
        }
    }
}}

module.exports = logger
