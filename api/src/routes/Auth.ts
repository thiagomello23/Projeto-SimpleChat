
import express from "express"
import {Register, Login} from "../interfaces/AuthInterface"
import database from "../helper/mongoDBConnection";
import UserSchema from "../schema/User";
import jwt from "jsonwebtoken"
import * as dotenv from 'dotenv'
import bcrypt from "bcrypt"
import validator from "validator"
import jwtAuthMiddleware from "../middleware/jwtAuthMiddleware";
const route = express.Router();

dotenv.config()
const Usuario = database.model("User", UserSchema)

// Rotas para login e cadastro
// Usar o validator
route.post("/auth/register", async (req, res) => {
    const data: Register = req.body;

    // Verifica o email do usuario, senha e nome
    if(validator.isEmpty(data.email) || validator.isEmpty(data.senha) || validator.isEmpty(data.nome)) {
        return res.status(200).json({error: true, msg: "Por favor, preencha todos os dados!"})
    }

    // Verificar se o email ja existe!
    const userDocEmail = await Usuario.findOne({email: data.email})

    if(userDocEmail) {
        return res.status(200).json({msg: "Email invalido", error:true});
    }

    // Criptografar a senha
    const cript = await bcrypt.hash(data.senha, +process.env.SALT_ROUNDS_BCRYPT!)

    // Salvar os dados no mongoDB
    try {
        const usuarioDoc = new Usuario({email: data.email, nome: data.nome, bio: "", senha: cript, profilePic: "", status: "Online"})
        const saved = await usuarioDoc.save({validateBeforeSave: true});

        const token = jwt.sign({email: data.email, id: saved._id}, process.env.JWT_SECRET!)

        return res.status(200).json({msg: "Usuario criado com sucesso!", token: token});
    } catch(err) {
        return res.status(500).json({msg: "Houve um erro, tente novamente!", error: true})
    }

})

route.post("/auth/login", async (req, res) => {
    const data: Login = req.body;

    // Validar os dados
    if(validator.isEmpty(data.email) || validator.isEmpty(data.senha)) {
        return res.status(200).json({error: true, msg: "Email ou senha invalidos!"})
    }

    if(!validator.isEmail(data.email)) {
        return res.status(200).json({error: true, msg: "Email invalido"})
    }

    const verifyAccount = await Usuario.findOne({email: data.email});

    // Verifica se existe o email
    if(verifyAccount) {

        // Compara as senhas
        const match = await bcrypt.compare(data.senha, verifyAccount.senha)

        if(!match) {
            return res.status(200).json({error: true, msg: "Senha incorreta!"})
        }

        const token = jwt.sign({email: data.email, id: verifyAccount._id}, process.env.JWT_SECRET!);

        return res.status(200).json({error: false, msg: "Logado com sucesso!", token: token});

    } else {
        return res.status(200).json({error: true, msg: "Email ou senha invalidos!"})
    }
})

// Valida apenas se um token e valido
route.get("/auth/validator", jwtAuthMiddleware, async (req, res) => {
    return res.status(200).json({msg: "Token valido", error: false})
});

export default route;
// Padrao para rota auth: {msg: "", error: "", token: ""}