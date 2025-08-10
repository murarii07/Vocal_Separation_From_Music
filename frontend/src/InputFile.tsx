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
  const [alertt, setAlertt] = useState({ flag: false, message: "alert" })
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState({ flag: false, message: "error" })
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

      const { data } = await axios.post(import.meta.env.VITE_API_URL, d,
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
      const datas = await fetch(import.meta.env.VITE_STREAM_URL, { credentials: "include" })
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
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Card */}
      <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-8 shadow-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Upload Audio File</h2>
          <p className="text-neutral-400">Choose an audio file to process and extract vocals</p>
        </div>

        {/* File Input Section */}
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="picture" className="text-sm font-medium text-neutral-300 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              Select Audio File
            </Label>

            <div className="relative group">
              <Input
                id="picture"
                type="file"
                className="w-full h-14 text-white bg-neutral-800/50 border-2 border-dashed border-neutral-600 hover:border-blue-500 transition-all duration-300 cursor-pointer rounded-xl file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-blue-500 file:to-purple-600 file:text-white file:font-medium file:cursor-pointer hover:bg-neutral-700/50"
                onChange={onChange}
                accept="audio/*"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>

            {file.size > 0 && (
              <div className="flex items-center gap-3 text-sm text-green-400 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                File selected successfully
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              onClick={fetc}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[140px]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Process Audio
                </div>
              )}
            </Button>
          </div>

          {/* Loading Animation */}
          {loading && (!responseFile.size) && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-neutral-700"></div>
                <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              </div>
              <div className="text-center">
                <p className="text-white font-medium">Processing your audio...</p>
                <p className="text-neutral-400 text-sm mt-1">This may take a few moments</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alert Messages */}
      <div className="mt-4">
        <AlertMessage alertt={alertt} alertChange={setAlertt} description={alertt.message} />
        <AlertMessage alertt={error} alertChange={setError} description={error.message} />
      </div>
    </div>
  )
}