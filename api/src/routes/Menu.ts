
import express from "express"
import database from "../helper/mongoDBConnection";
import UserSchema from "../schema/User";
import jwt from "jsonwebtoken"
import jwtAuthMiddleware from "../middleware/jwtAuthMiddleware"
import * as dotenv from 'dotenv'

dotenv.config()

// Model
const Usuario = database.model("User", UserSchema)

const route = express.Router();

// Pesquisar contato via email
route.get("/menu/:email", async (req, res) => {

    const email = req.params.email;

    const data = await Usuario.findOne({email: email}, {
        profilePic: true,
        nome: true,
        status: true
    })

    if(!data) {
        return res.status(200).json({msg: "Contato nao encontrado", error: true})
    } 

    return res.status(200).json(data);

})

// Adicionar um contato
route.post("/menu/add", async (req, res) => {

    // Pegar dados do token
    const token = req.headers["authorization"]
    const tokenData: any = jwt.decode(token!);

    // Fazer varias validacoes
    // Nao adicionar o mesmo contato
    // Fazer uma validacao para saber se o email atual e o email pesquisado, se sim bloquear
    // Faz uma verificacao se e um email valido
    const { email } = req.body;

    // Acha o contato
    const user = await Usuario.findOne({email: email})

    if(!user) {
        return res.status(200).json({msg: "Usuario nao encontrado", error: true})
    }

    // Se der erro dizer que houve falha ao adicionar o contato
    // Adicionar as informacoes do contato
    await Usuario.updateOne({email: tokenData.email}, {
        $push: {
            amigos: {
                nome: user.nome,
                bio: user.bio,
                profilePic: user.profilePic,
                status: user.status,
                email: user.email
            }
        }
    })

    return res.status(200).json({msg: "Usuario adicionado com sucesso!", error: false})
})

export default route;