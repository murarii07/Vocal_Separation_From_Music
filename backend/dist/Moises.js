"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import Moises, { Job } from "moises/sdk.js";
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const apiKey = process.env.API_KEY || "";
const workflow = process.env.WORKFLOW_NAME || "";
async function musicToVocals(userPath, id) {
    try {
        const { default: Moises } = await import("moises/sdk.js");
        const moises = new Moises({ apiKey: apiKey });
        // newly-created-vocals this workflow i have created on music.ai
        const downloadUrl = await moises.uploadFile(userPath);
        const jobId = await moises.addJob("job-1", workflow, { inputUrl: downloadUrl });
        const job = await moises.waitForJobCompletion(jobId);
        if (job.status === process.env.MOISES_STATUS) {
            const files = await moises.downloadJobResults(job, `./stems/${id}`);
            console.log("Result:", files);
            moises.deleteJob(jobId).catch((error) => {
                console.log(error);
                throw new Error(error);
            });
            return files;
        }
        else {
            throw new Error("error");
        }
    }
    catch (e) {
        throw new Error(e.message);
    }
}
exports.default = musicToVocals;
