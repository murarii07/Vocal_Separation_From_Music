"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const Moises_js_1 = __importDefault(require("./Moises.js"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const listId_js_1 = require("./listId.js");
const listId_js_2 = require("./listId.js");
const app = (0, express_1.default)();
app.use(express_1.default.static("./public"));
app.use(express_1.default.json());
app.use((0, express_1.urlencoded)({ extended: false }));
app.use((0, cookie_parser_1.default)());
const storage = multer_1.default.memoryStorage();
const uploads = (0, multer_1.default)({ storage });
const listobj = new listId_js_2.listId();
const uploadRoute = async (req, res) => {
    try {
        console.log("oHH my god", true, req.cookies.fileId);
        if (req.cookies.fileId) {
            return res.status(200).json({ error: 'you can use only once' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        const file = req.file;
        fs_1.default.writeFileSync(`public/uploads/${file.originalname}`, file.buffer);
        let id = (0, listId_js_1.userIdGenerator)();
        const result = await (0, Moises_js_1.default)(`public/uploads/${file.originalname}`, id);
        console.log(id);
        listobj.listAdd(id);
        return res.status(200).cookie("fileId", id, { maxAge: 60 * 1000 * 1000, httpOnly: true, secure: true, path: "/" }).json({
            message: "succedded"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: error
        });
    }
};
const downloadRoute = async (req, res) => {
    const fileId = req.cookies?.fileId;
    try {
        if (!listobj.isExist(fileId)) {
            return res.status(404).json({
                error: "not found"
            });
        }
        //Extracting the file based on the id
        return res.download(`./stems/${fileId}/vocal.wav`);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: error
        });
    }
    finally {
        setTimeout(() => {
            console.log(fs_1.default.existsSync(`./stems/${fileId}`));
            if (fs_1.default.existsSync(`./stems/${fileId}`)) {
                fs_1.default.rmSync(`./stems/${fileId}`, { recursive: true, force: true });
                listobj.listRemove(fileId);
            }
        }, 0);
    }
};
const streamApi = async (req, res) => {
    let id = listobj.isExist(req.cookies?.fileId);
    console.log(req.cookies?.fileId);
    if (!id) {
        res.status(400).json({ error: 'No file uploaded.' });
    }
    let c = fs_1.default.createReadStream(`./stems/${req.cookies.fileId}/vocal.wav`);
    c.pipe(res);
};
app.post("/upload", uploads.single("music"), uploadRoute);
app.get("/download", downloadRoute);
app.get("/stream", streamApi);
app.listen(3000, () => {
    console.log("server startd");
});
