const mongoose = require('mongoose')
const CONFIG = require('../config/constant')

module.exports = {
    connection : null,
    connect: () => {
        return mongoose.connect(CONFIG.DB, {useUnifiedTopology:true, useNewUrlParser: true})
        .then( connection => {
            this.connection = connection;
            console.log('conexion exitosa a la db')
        })
        .catch( err => console.log(err))
    }
}