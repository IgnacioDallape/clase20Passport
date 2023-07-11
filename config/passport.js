const passport = require("passport")
const LocalStrategy = require('passport-local').Strategy
const userModel = require('../models/userModel')
const { createHash, isValidPassword }  = require('../utils/bcrypts')

//necesito 2 estrategias, una para login y otra para inicio, para eso llamo a strategy, para poder hacerlo un constructor de estrategias

const initializePassport = () => {
    //primera estrategia

    passport.use('register', new LocalStrategy(    //el primer argumento es el nombre de esta estrategia, el segundo es un constructor, y lo abro para acceder a sus propiedades
        {passReqToCallback: true, usernameField:'email'} ,          // passReqToCallback es un booleano que viene en false por defecto, lo ponemos en true y esto hace que ademas de la contraseña, se guarde todo lo del usuario, por ej, telefono, sexo , etc, usernameField es una propiedad en la que definimos que campo vamos a usar para hacer la autenticacion, el programa no sabe cual necesitamos, le tenemos que decir, este va a ser el username, en este caso, el email
        async (req, username, password, done) => {                //aca se hace el callback, donde traigo el req, para poder acceder a los campos como email, password, telefono,etc, y el segundo argumento es el      email , el tercero es el password, y el ultimo es el done, es una  funcion usada pára terminar procesos, por ejemplo si el usuario no se encontro
            try{
                let userData = req.body                
                //buscar en la base de datos si el usuario existe, no sirve guardar un usuario que ya existe
                let user = await userModel.findOne({email: username})
                if(user){
                    console.log('usuario existente')
                    done(null,false)  //si existe, no quiero seguir con el registe, por eso aca usamos done, que le debemos pasar 2 parametros, null y false, funciona como el return
                }
                //si no existe, lo creo
                let userNew = {
                    name: userData.name,
                    email: userData.email,
                    password: createHash(userData.password), //aca no puedo guardar la contraseña de una, la hasheo si o si
                    celphone: userData.celphone
                }
                //y aca lo guardo
                let result = await userModel.create(userNew)
                done(null, result) //siempre, si llega hasta aca se ejecutas este done, que el segundo argumento es la creacion de un usuario con el modelo userModel

            } catch (err) {
                console.log(err)
                return done('error al crear el usuario ' + err)
            }
        }
    )),

    //esta se activa con el done que tiene el result, y el user que recibe, es result, es decir el usuario creado, sirve para guardar info del usuario en la session, en este caso solo se guarda el id
    passport.serializeUser((user,done) => {
        done(null, user._id)
    })
    //y esta le devuelve todo la info del usuario guardada en la session
    passport.deserializeUser(async (id,done) => {
        let user = await userModel.findById(id)
        done(null,user)
    })
}

module.exports = initializePassport