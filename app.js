const express = require('express')

const app = express()
const mongoose = require('mongoose')
const {MONGOURI} = require('./keys')
const PORT = 5000

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
})
mongoose.connection.on('connected',()=>{
    console.log('Connected to mongo ')
})

mongoose.connection.on('error',(error)=>{
    console.log('eeeor connection',error)
})

require('./models/user')
require('./models/post')

app.use(express.json())

app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))






app.listen(PORT,()=>{
    console.log(`Server is up on port ${PORT}`)
})