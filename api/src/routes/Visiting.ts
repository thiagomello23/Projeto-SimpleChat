
// Rota especifica para adicionar contatos
// Puxar dados de outros perfis
import express from "express"
import database from "../helper/mongoDBConnection"
import UserSchema from "../schema/User";
import * as dotenv from 'dotenv'
import jwtAuthMiddleware from "../middleware/jwtAuthMiddleware";

// Dotenv
dotenv.config()

// Model
const Usuario = database.model("User", UserSchema)

const route = express.Router();

// Rotas da API
route.get("/visiting/user/:email", jwtAuthMiddleware, async (req, res) => {
    const email = req.params.email;

    if(!email) {
        return res.status(200).json({error: true, msg: "Email invalido"})
    }

    // Puxa os dados do banco de dados
    const data = await Usuario.findOne({email: email})

    // Monta um arquivo modelo para voltar apenas algumas informacoes
    // Forma improvisada de se fazer isso
    const dataFormatter = {
        nome: data?.nome,
        bio: data?.bio,
        status: data?.status,
        profilePic: data?.profilePic,
    }

    // Retorna os dados
    return res.status(200).json(dataFormatter);
})

export default route;