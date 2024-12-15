import express, { urlencoded, Request, Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import musicToVocals from "./Moises.js";
import { RequestHandler } from 'express-serve-static-core';
import cookieParser from 'cookie-parser';
import { userIdGenerator } from './listId.js';
import { listId } from './listId.js';
import { error } from 'console';
const app = express();
app.use(express.static("./public"))
app.use(express.json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())
const storage = multer.memoryStorage();
const uploads = multer({ storage });
const listobj:listId = new listId()
const uploadRoute: RequestHandler = async (req, res): Promise<any> => {
    try {
        console.log("oHH my god",true,req.cookies!.fileId)
        if(req.cookies!.fileId){
            return res.status(200).json({ error: 'you can use only once' })
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const file: Express.Multer.File = req.file;
        fs.writeFileSync(`public/uploads/${file.originalname}`, file.buffer);
        let id = userIdGenerator()
        const result = await musicToVocals(`public/uploads/${file.originalname}`, id);
        console.log(id);
        listobj.listAdd(id)
        return res.status(200).cookie("fileId", id, { maxAge: 60 * 1000 * 1000, httpOnly: true, secure: true, path: "/" }).json({
            message: "succedded"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error
        });
    }
}
const downloadRoute: RequestHandler = async (req, res): Promise<any> => {
    const fileId: string = req.cookies?.fileId;
    try {
        if (!listobj.isExist(fileId)) {
            return res.status(404).json({
                error: "not found"
            });
        }
        //Extracting the file based on the id
        return res.download(`./stems/${fileId}/vocal.wav`);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: error
        });
    }
    finally {
        setTimeout(()=>{
            console.log(fs.existsSync(`./stems/${fileId}`))
            if (fs.existsSync(`./stems/${fileId}`)) {
                fs.rmSync(`./stems/${fileId}`, { recursive: true, force: true })
                listobj.listRemove(fileId)
            }
            
        },0)
    }
}
const streamApi: RequestHandler = async (req, res): Promise<any> => {
    let id = listobj.isExist(req.cookies?.fileId)
    console.log(req.cookies?.fileId)
    if (!id) {
        res.status(400).json({ error: 'No file uploaded.' });
    }
    let c = fs.createReadStream(`./stems/${req.cookies.fileId}/vocal.wav`)
    c.pipe(res)
}

app.post("/upload", uploads.single("music"), uploadRoute)
app.get("/download", downloadRoute)
app.get("/stream", streamApi)
app.listen(3000, () => {
    console.log("server startd")
})



