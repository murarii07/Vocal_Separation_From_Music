// import Moises, { Job } from "moises/sdk.js";
import { config } from "dotenv"
config()
const apiKey: string = process.env.API_KEY || ""
const workflow: string = process.env.WORKFLOW_NAME || ""
async function musicToVocals(userPath: string, id: string): Promise<object> {
    try {
        const { default: Moises } = await import("moises/sdk.js");
        const moises = new Moises({ apiKey: apiKey })

        // newly-created-vocals this workflow i have created on music.ai
        const downloadUrl = await moises.uploadFile(userPath)
        const jobId = await moises.addJob("job-1", workflow, { inputUrl: downloadUrl })
        const job = await moises.waitForJobCompletion(jobId)

        if (job.status === process.env.MOISES_STATUS) {
            const files: object = await moises.downloadJobResults(job, `./stems/${id}`)
            console.log("Result:", files)
            moises.deleteJob(jobId).catch((error) => {
                console.log(error)
                throw new Error(error);
            })
            return files
        } else {
            throw new Error("error");
        }

    } catch (e:any) {
        throw new Error(e.message);
    }
}
export default musicToVocals;
