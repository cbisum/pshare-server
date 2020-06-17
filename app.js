const express = require('express')

const app = express()
const mongoose = require('mongoose')
const {MONGOURI} = require('./config/keys')
const port = process.env.PORT|| 5000

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


if(process.env.NODE_ENV=='production'){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}



app.listen(port,()=>{
    console.log(`Server is up on port ${port}`)
})