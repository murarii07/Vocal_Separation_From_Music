import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import axios from "axios";

import { AlertMessage } from "./AlertMessage";
import { durationInSecUpdate, durationUpdate, srcUpdate, vocalsrcUpdate } from "./redux/audio";
import { useDispatch } from "react-redux";

export function InputFile() {
  const dispatch = useDispatch()
  const [file, setFile] = useState(new Blob())
  const [loading, setLoading] = useState(false)
  const [alertt, setAlertt] = useState({flag:false,message:"alert"})
  const [duration, setDuration] = useState(0)
  const [error,setError]=useState({flag:false,message:"error"})
  const [responseFile, setResponseFile] = useState(new Blob())
  const onChange = (e: any) => {
    console.log(file)
    console.log(e.target.files)
    console.log(URL.createObjectURL(e.target.files[0]))
    setFile(e.target.files[0])
    const ss = new Audio(URL.createObjectURL(e.target.files[0]))
    ss.onloadedmetadata = () => {
      setDuration(ss.duration)
      dispatch(srcUpdate(URL.createObjectURL(e.target.files[0])))
    }
  }
  useEffect(() => {
    let r = duration / 60
    dispatch(durationInSecUpdate(Math.round(duration)))
    dispatch(durationUpdate({ min: r.toFixed(0), sec: Math.round(duration % 60) }))
  }, [duration])
  async function fetc() {
    if (!file.size) {
      setAlertt({...alertt,flag:true,message:"please upload a file"})
      return
    }
    setLoading(true)
    const d = new FormData()
    d.append("music", file)
    try {

      const { data } = await axios.post('http://localhost:3000/upload', d,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      console.log(data.error)
      if(data.error){
        setError({flag:true,message:data.error})
        setLoading(false)
        return;
      }
      const datas = await fetch("http://localhost:3000/stream", { credentials: "include" })
      if (!datas.body) {
        throw new Error("ReadableStream is not supported.");
      }
      const s = datas.body.getReader()
      const chunks: Uint8Array[] = [];
      while (1) {
        const { done, value } = await s.read()
        if (done) break;
        chunks.push(value);
      }
      // setFile(chunks)
      const audioBlob = new Blob(chunks, { type: "audio/wav" });
      console.log(URL.createObjectURL(audioBlob))
      setResponseFile(audioBlob)
      dispatch(vocalsrcUpdate(URL.createObjectURL(audioBlob)))
      setLoading(false)
      const ss = new Audio(URL.createObjectURL(audioBlob))
      console.log(ss)


    } catch (error: any) {
      console.log(error)
      setError({flag:true,message:error.message})
      setLoading(false)
    }

  }

  return (
    <div className="flex w-7/12 md:11/12  flex-col h-52  gap-2.5  justify-start ">
      <div className="w-11/12 h-2/4 flex flex-col items-start mt-4 gap-2 ml-4 rounded-md">

        <Label htmlFor="picture" className="text-neutral-400 px-2">Enter Audio</Label>
        <Input id="picture" type="file" className="w-full h-3/4 text-white cursor-pointer p-3 " placeholder="Browser your file....." onChange={onChange} />
      </div>
      <Button variant="outline" className="ml-4 bg-transparent text-white hover:bg-white hover:text-black font-bold cursor-pointer w-1/4 text-wrap" onClick={fetc}>Submit</Button>

      {loading && (!responseFile.size) ? (<img src="assets/loading.gif" alt="" className="min-w-18 min-h-24" />) : ""}

      <AlertMessage alertt={alertt} alertChange={setAlertt}  description={alertt.message} />
      <AlertMessage alertt={error} alertChange={setError} description={error.message}/>
    </div >
  )
}
