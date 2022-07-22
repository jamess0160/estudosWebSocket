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
let pessoasConectadas = []

socket.on('connection', (stream) => {
	var nomeStream;
	pessoasConectadas.push(stream.id)
	socket.emit("nomes", pessoasConectadas)

	console.log(new Date(), ">> nova conexão:", stream.id)
	stream.emit('attMensagem', mensagens)

	stream.on("msg", payload => {
		mensagens.push({ origem: payload.nome || stream.id, msg: payload.msg, hora: payload.hora })
		if(payload.msg == "/clear"){
			mensagens = []
		}
		socket.emit('attMensagem', mensagens)
	})

	stream.on("attName", (payload)=>{
		nomeStream = payload.nome
		let index = pessoasConectadas.indexOf(stream.id)
		pessoasConectadas[index] = payload.nome
		socket.emit("nomes", pessoasConectadas)
	})

	stream.on("disconnect", ()=>{
		let indexNome = pessoasConectadas.indexOf(nomeStream)
		pessoasConectadas[indexNome] = null
		let indexID = pessoasConectadas.indexOf(stream.id)
		pessoasConectadas[indexID] = null
		pessoasConectadas = pessoasConectadas.filter(item=> item !== null)
		socket.emit("nomes", pessoasConectadas)
	})
})

server.listen(4001, () => {
	console.log("servidor iniciado em: http://localhost:4001")
})