const express = require('express')
const { Router } = express
const router = new Router()
const { createHash, isValidPassword } = require('../utils/bcrypts')
const passport = require('passport')

let users = []

router.get('/all', (req,res) => {
    try{
        res.send(users)
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

router.post('/register', passport.authenticate('register', {failureRedirect:'/users/failedRegister'}), (req, res) => {  //middleware con 2 argumentos, el primero lleva el nombnre de la estrategia de passport que quiero usar, register en este caso, y el segundo es para saber que hacer si fallala estrategia, por ejemplo puedo redirigir a algun lado
    try{
        console.log('usuario registrado')
        res.send('user registrado')
    } catch(err) {
        console.log(err)
        res.send(err)
    }
})
//aca viene si falla el middleware
router.get('/failedRegister', (req,res) => {
    res.send('failed register')
})

router.post('/login', (req,res) => {
    try{
        let loginUser = req.body
        let user = users.find( u => { 
            return u.username == loginUser.username
        })
        console.log(user)
        if(!user){
            console.log('usuario no existe')
            res.send('invalid user')
            return false
        }
        if(!isValidPassword(user, loginUser.password)){
            console.log('usuario no existe')
            res.send('invalid user')
            return false
        }
        res.send('loged')

    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

module.exports = router