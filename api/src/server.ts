
import express from "express"
import database from "./helper/mongoDBConnection"
import AuthRoute from "./routes/Auth"
import ProfileRoute from "./routes/Profile"
import VisitingRoute from "./routes/Visiting"
import MenuRoute from "./routes/Menu"
import cors from "cors"
import path from "path"
import fs from "fs"
import https from "https"
const app = express();

// Criar a conexao com o socket.io

// testar conexao do socket com o node.js
// separar rotas do express
// conectar mongodb com o mongoose
// criar os schemas
// criar as rotas de login e cadastro
// manusear erros de api
// criar o middleware para authenticacao JWT

// Middlewares
app.use(express.json())
app.use(cors())
app.use("/files", express.static(path.resolve("./src/upload")))

app.use(AuthRoute);
app.use(ProfileRoute)
app.use(VisitingRoute)
app.use(MenuRoute)

app.listen(4000, () => {
    console.log("Servidor rodando: https://localhost:4000/");
})