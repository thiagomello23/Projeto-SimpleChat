
import express from "express"
import database from "../helper/mongoDBConnection"
import * as dotenv from 'dotenv'
import jwtAuthMiddleware from "../middleware/jwtAuthMiddleware"
import UserSchema from "../schema/User"
import jwt from "jsonwebtoken"
import { Bio, Name, Password, Status } from "../interfaces/ProfileInterface"
import bcrypt from "bcrypt"
import upload from "../helper/MulterConfig"

dotenv.config()

// Model
const Usuario = database.model("User", UserSchema)

const route = express.Router();

// Retorna todos os dados de um perfil
route.get("/profile", jwtAuthMiddleware, async (req, res) => {

    const token = req.headers["authorization"];

    const tokenData: any = jwt.decode(token!);

    const data = await Usuario.findOne({email: tokenData.email});

    if(data) {
        // data.profilePic =  "F:/Desenvolvimento/Projetos/faculdade-message-app/api/src/upload/" + data?.profilePic;
        return res.status(200).json(data)
    } else {
        return res.status(200).json({msg: "Email invalido!", error: true})
    }
});

// Atualiza a bio de um perfil
route.post("/profile/bio", jwtAuthMiddleware, async (req, res) => {

    const token = req.headers["authorization"]
    const tokenData: any = jwt.decode(token!);

    const data: Bio = req.body;

    await Usuario.findOneAndUpdate({email: tokenData.email}, {
        $set: {
            bio: data.bio
        }
    })

    return res.status(200).json({msg: "Atualizado com sucesso!", error: false})
})

// Atualiza o nome de um perfil
route.post("/profile/name", jwtAuthMiddleware, async (req, res) => {

    const token = req.headers["authorization"]
    const tokenData: any = jwt.decode(token!);

    const data: Name = req.body;

    await Usuario.findOneAndUpdate({email: tokenData.email}, {
        $set: {
            nome: data.name
        }
    })

    return res.status(200).json({msg: "Atualizado com sucesso!", error: false})

})

// Troca senha de um perfil
route.post("/profile/password", async (req, res) => {
    const token = req.headers["authorization"]
    const tokenData: any = jwt.decode(token!);

    // Pegar a nova senha
    const data: Password = req.body;

    // Criptografar a nova senha
    const cript = await bcrypt.hash(data.password, +process.env.SALT_ROUNDS_BCRYPT!)

    // Atualizar a seha criptografada no banco de dados
    await Usuario.findOneAndUpdate({email: tokenData.email}, {
        $set: {
            senha: cript
        }
    })

    return res.status(200).json({msg: "Atualizado com sucesso!", error: false})
})

// Atualiza status de um perfil
route.post("/profile/status", jwtAuthMiddleware, async (req, res) => {

    // Pegar os dados do token
    const token = req.headers["authorization"]
    const tokenData: any = jwt.decode(token!);

    // Pegar os dados do status
    const data: Status = req.body;
    // Atualizar os dados
    await Usuario.findOneAndUpdate({email: tokenData.email}, {
        $set: {
            status: data.status
        }
    })

    // Retornar mensagem de sucesso
    return res.status(200).json({error: false, msg: "Atualizado com sucesso!"})
})

// Atualiza a foto de um perfil
route.post("/profile/photo", jwtAuthMiddleware, upload.single("profilePic"), async (req, res) => {
    
    // Dados do token
    const token = req.headers["authorization"]
    const tokenData: any = jwt.decode(token!);

    // Arquivos estao sendo uploadados no disco local
    if(!req.file) {
        return res.status(200).json({error: true, msg: "Houve um erro ao enviar o arquivo!"})
    }

    // Uploada no banco de dados
    const filename = req.file.filename;

    await Usuario.findOneAndUpdate({email: tokenData.email}, {
        $set: {
            profilePic: filename
        }
    })

    // Retorno com a URL da nova foto
    return res.status(200).json({msg: "Foto alterada com sucesso!", error: false, profilePicUrl: "/api/src/upload/" + filename})
})

export default route;
// {msg: "", error: boolean}