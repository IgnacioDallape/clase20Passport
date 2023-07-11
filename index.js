const express = require('express')
const app = express()
app.use(express.json())
const PORT = 8080
const usersRouter = require('./routes/user.routes')
const session = require('express-session')
const MongoStore = require('connect-mongo')

const Database = require('./db/db')
const initializePassport = require('./config/passport')

//session

app.use(session({
    store: MongoStore.create({
        mongoUrl:'mongodb+srv://clase20:clase20@clase20.lgdqv7j.mongodb.net/data'
    }) ,
    secret:'secret',
    resave:true,
    saveUninitialized:true
}))

//passport

const passport = require('passport') //passport crea sesiones, no lo tengo que hacer con req.session

initializePassport() //inicializar antes de la ruta
app.use(passport.initialize()) //aca la inicializo
app.use(passport.session({   //pero aca tengo que tener configurado mongostore para que funcione, entonces cada vez que lo necesite, passport va a pasar por store y va a crear la session
    
}))
app.use('/users', usersRouter)

app.listen(PORT, () => {
    console.log('Server running in port', PORT);
    Database.connect()
})
