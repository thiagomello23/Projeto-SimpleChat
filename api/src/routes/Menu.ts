
import express from "express"
import database from "../helper/mongoDBConnection";
import UserSchema from "../schema/User";
import ChatSchema from "../schema/Chat"
import jwt from "jsonwebtoken"
import jwtAuthMiddleware from "../middleware/jwtAuthMiddleware"
import validator from "validator";
import * as dotenv from 'dotenv'
import { ObjectId } from "mongoose";
import FriendNotifySchema from "../schema/FriendNotify";

dotenv.config()

// Model
const Usuario = database.model("User", UserSchema)
const Chat = database.model("Chat", ChatSchema)
const FriendNotify = database.model("FriendNotify", FriendNotifySchema);

const route = express.Router();

// Adicionar um contato
route.post("/menu/notify", jwtAuthMiddleware, async (req, res) => {

    // Pegar dados do token
    const token = req.headers["authorization"]
    const tokenData: any = jwt.decode(token!);

    const { email } = req.body;

    // Verifica se e um email valido
    if(!validator.isEmail(email)) {
        return res.status(200).json({msg: "", error: true})
    }

    // Valida se o usuario nao esta tentando se adicionar
    if(tokenData.email == email) {
        return res.status(200).json({msg: "Usuario nao pode se adicionar", error: true})
    }

    // Pega os dados do usuario que esta tentando adicionar
    const addUser = await Usuario.findOne({email: email})

    // Valida se o usuario existe
    if(!addUser) {
        return res.status(200).json({msg: "Usuario nao encontrado!", error: true})
    }

    // MUDAR
    // Valida se o usuario ja esta adicionado
    const isFriendAdded = await FriendNotify.findOne({
        $or: [
            {
                sender_id: tokenData.id,
                receiver_id: addUser._id,
                accept: true
            }, 
            {
                sender_id: addUser._id,
                receiver_id: tokenData.id,
                accept: true
            }
        ]
    })

    // MUDAR 
    if(isFriendAdded){
        return res.status(200).json({msg: "Usuario ja esta adicionado!", error: true})
    }

    // Adiciona uma notificacao no contato de quem recebeu
    await FriendNotify.create({
        accept: false,
        receiver_id: addUser._id,
        sender_id: tokenData.id,
        sender_email: tokenData.email
    })

    // Cria um chat entre os amigos
    await Chat.create({
        participantes: [tokenData.id, addUser._id],
        mensagens: []
    })

    return res.status(200).json({msg: "Usuario adicionado com sucesso!", error: false})
})

route.get("/menu/notify", jwtAuthMiddleware, async (req, res) => {

    // Pegar dados do token
    const token = req.headers["authorization"]
    const tokenData: any = jwt.decode(token!);

    const notificationsDetail = await FriendNotify.find({
        receiver_id: tokenData.id,
        accept: false
    })

    return res.status(200).json(notificationsDetail);

})

route.get("/menu/notify/count", jwtAuthMiddleware, async (req, res) => {

    // Pegar dados do token
    const token = req.headers["authorization"]
    const tokenData: any = jwt.decode(token!);

    // conta quantas notificacoes de amizade tem
    const numbersOfNotifications = await FriendNotify.countDocuments({
        receiver_id: tokenData.id,
        accept: false
    })

    return res.status(200).json({msg: "Numero de notificacoes enviada com sucesso!", number: numbersOfNotifications, error: false})
})

route.post("/menu/addContact", jwtAuthMiddleware, async (req, res) => {

    // Pegar dados do token
    const token = req.headers["authorization"]
    const tokenData: any = jwt.decode(token!);

    const { sender_id } = req.body;

    // Adiciona as informacoes em ambos os contatos
    await Usuario.bulkWrite([
        {updateOne: 
            {
                filter: {_id: sender_id},
                update: {
                    $push: {
                        amigos: tokenData.id
                    }
                }
            }
        },
        {updateOne: 
            {
                filter: {email: tokenData.email},
                update: {
                    $push: {
                        amigos: sender_id
                    }
                }
            }
        },
    ])

    await FriendNotify.updateOne({
        sender_id: sender_id,
        receiver_id: tokenData.id
    }, {
        accept: true
    })

    return res.status(200).json({error: false, msg: "Usuario adicionado com sucesso!"})
})

route.post("/menu/denyContact", jwtAuthMiddleware, async (req, res) => {

    // Pegar dados do token
    const token = req.headers["authorization"]
    const tokenData: any = jwt.decode(token!);

    const { sender_id } = req.body; 

    await FriendNotify.deleteOne({
        sender_id: sender_id,
        receiver_id: tokenData.id
    })

    return res.status(200).json({msg: "Pedido de amizade negado com sucesso!", error: false})
})

export default route;