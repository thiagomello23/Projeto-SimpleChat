import multer from "multer";
import { nanoid } from "nanoid"
import path from "path"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve("./src/upload"))
    },
    filename: (req, file, cb) => {
        const name = nanoid(40) + "-" + file.originalname
        cb(null, name);
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Fazer um filtro de arquivos
        cb(null, true)
    }
})

export default upload;