const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const app = express()
const cors = require('cors')

app.use(cors())
const server = http.createServer(app)
const socket = socketIO(server)
app.use(express.static('./public'))

let mensagens = []

socket.on('connection', (stream) => {
    stream.emit('attMensagem', mensagens)

    stream.on("msg", recebe => {
        mensagens.push({ origem: recebe.nome || stream.id, msg: recebe.msg, hora: recebe.hora })
        socket.emit('attMensagem', mensagens)
    })
})
setTimeout(()=>{
    socket.emit('atualizou', true)
}, 1000)



server.listen(4000, () => {
    console.log("servidor iniciado em: http://localhost:4000")
})