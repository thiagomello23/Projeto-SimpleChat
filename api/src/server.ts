
import express from "express"
import database from "./helper/mongoDBConnection"
import AuthRoute from "./routes/Auth"
import ProfileRoute from "./routes/Profile"
import VisitingRoute from "./routes/Visiting"
import MenuRoute from "./routes/Menu"
import cors from "cors"
import path from "path"
import { createServer } from "http"
import { Server } from "socket.io"
import ChatSchema from "./schema/Chat"
import jwt from "jsonwebtoken"

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

// Model
const Chat = database.model("Chat", ChatSchema)

// Middlewares
app.use(express.json())
app.use(cors())

// File Route
app.use("/files", express.static(path.resolve("./src/upload")))

// Routes
app.use(AuthRoute);
app.use(ProfileRoute)
app.use(VisitingRoute)
app.use(MenuRoute)

// Socket
io.on("connection", (socket) => {

    socket.on("chat:joinning-room", async (data, cb) => {
        const decodedData: any = jwt.decode(data.senderToken)

        const chatData = await Chat.findOne({
            participantes: {$all: [decodedData.id, data.receiverId]}
            
        })

        cb({
            chatRoomId: chatData?._id,
            chatData: chatData
        })
    })

    socket.on("chat:sending-message", async (data) => {
        const { chatRoomId, content, sender} = data;

        const decodedData: any = jwt.decode(sender);
        
        // Salvar os dados no banco
        const chatData = await Chat.findByIdAndUpdate(chatRoomId, {
            $push: {
                mensagens: {
                    sender: decodedData.id,
                    content: content,
                    isFile: false,
                    createdAt: new Date()
                }
            }
        }, {returnDocument: "after"})

        // Mandar um evento para atualizar os dados
        io.emit("chat:updating-message", chatData)

    })

})

httpServer.listen(4000, () => {
    console.log("Servidor rodando: https://localhost:4000/");
})