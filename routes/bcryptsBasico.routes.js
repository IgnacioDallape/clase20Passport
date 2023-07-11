const express = require('express')
const { Router } = express
const router = new Router()
const { createHash, isValidPassword } = require('../utils/bcrypts')

let users = []

router.get('/all', (req,res) => {
    try{
        res.send(users)
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

router.post('/register', (req, res) => {
    try{
        let userNew = req.body;
        userNew.id = Math.random();
        userNew.password = createHash(userNew.password)
        users.push(userNew)
        res.send({
            message: 'usuario creado',
            userNew: userNew
        })
    } catch(err) {
        console.log(err)
        res.send(err)
    }
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