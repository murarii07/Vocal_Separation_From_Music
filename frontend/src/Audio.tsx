import { Progress } from './components/ui/progress'
import { Button } from './components/ui/button'
import { useEffect, useRef, useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { Label } from './components/ui/label'
import { useSelector } from 'react-redux'
import { RootState } from './redux/store'
import { useDispatch } from 'react-redux'
import { currentPositionUpdate } from './redux/audio'
import { saveAs } from 'file-saver'
import { AlertMessage } from './AlertMessage'
import { IoMdPlayCircle } from "react-icons/io";
import { FaDownload } from "react-icons/fa";
import { CiPause1 } from "react-icons/ci";
export const AudioCard = () => {
  const dispatch = useDispatch()
  const audioPlay = useSelector((s: RootState) => s.audioPlay)
  const dur = audioPlay.duration
  const durInSec = audioPlay.durationInSec
  const vocalSrc = audioPlay.vocalAudioSrc
  const currentTime = audioPlay.currentPosition
  const uploadedAudio = audioPlay.src
  const [count, setCount] = useState(0)
  const [toggle, setToggle] = useState(true)
  const [play, setPlay] = useState(false)
  const [error, setError] = useState({ flag: false, message: "error" })
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const src = toggle ? vocalSrc : uploadedAudio;
  useEffect(() => {
    const updateCount = () => {
      setCount(parseInt(audioRef.current!.currentTime.toFixed(0)))
      dispatch(currentPositionUpdate(audioRef.current!.currentTime))
      console.log(audioRef.current?.currentTime)
      console.log("percentage", count)
    };
    audioRef.current?.addEventListener("timeupdate", updateCount);
    return () => audioRef.current!.removeEventListener("timeupdate", updateCount);
  }
    , [count])


  useEffect(() => {
    dispatch(currentPositionUpdate(audioRef.current!.currentTime))
    if (audioRef.current) {
      audioRef.current.play()
      // setPlay(true)
      audioRef.current.currentTime = currentTime;
    }
  }, [toggle])

  function pauseAudioLogic(): void {
    setPlay(true)
    audioRef.current!.play();
    console.log("current time", currentTime)
  }
  function playAudioLogic(): void {
    console.log("hru")
    audioRef.current!.pause();
    dispatch(currentPositionUpdate(audioRef.current!.currentTime))
    setPlay(false)
  }

  const controlAudio = () => {
    console.log("current count", count, "pause:", (audioRef.current?.paused))
    if (audioRef.current && !(audioRef.current.paused)) {
      playAudioLogic()
    }
    else if (audioRef.current && audioRef.current.paused) {
      pauseAudioLogic()
    }
  };
  const handleDownload = () => {
    fetch("http://localhost:3000/download", {
      credentials: "include"
    })
      .then((data) =>
        data.blob()
          .then((dataa) => {
            saveAs(dataa, 'file.wav')
          })
          .catch((error) => {
            console.log("error")
            setError({ flag: true, message: error.message })
          }
          ))
      .catch(error =>
        setError({ flag: true, message: error.message })
      )
  }

  return (
    <div className='box  w-56 h-full flex flex-col gap-2 justify-center box-border'>

      <div className="box  w-full h-5/6 flex flex-col gap-2 box-border rounded-lg bg-neutral-900 shadow-lg shadow-black">
        <div className='w-[95%] h-[60%] mx-auto mt-2'> <div className='w-[75%] h-[90%] bg-white mx-auto rounded-lg overflow-hidden '> <img src="assets/d.jpg" alt="" className='w-full h-full rounded-lg' /></div></div>
        <Progress value={count / durInSec * 100} className='w-11/12 mx-auto bg-white' />

        <div className='
   mx-auto w-11/12 flex justify-between'><div>{count > 60 ? (count / 60).toFixed(0) : 0}:{count % 60}</div> <div>{dur.min}:{dur.sec}</div></div>
        <div className='w-full h-1/5'>
          <div className='w-full flex justify-center items-center h-full gap-x-3 cursor-pointer flex-wrap'>

            <Button className=' rounded-full w-1/6 h-5/6 shadow-md  flex items-center justify-center  mb-[4px]  '
              onClick={controlAudio} >
              {!play ? <IoMdPlayCircle style={{ maxWidth: "150px", width: "150px", height: "100%" }} />
                :
                <CiPause1 style={{ maxWidth: "150px", width: "150px", height: "100%" }} />}
            </Button>


          </div>

        </div>
      </div>{vocalSrc ?
        <>
          <div className='w-full bg-neutral-900 rounded-md p-2 flex gap-5 items-center justify-center flex-wrap'>   <Label htmlFor='vocal'>Vocal</Label>
            <Switch onCheckedChange={() => {

              setToggle(!toggle)


            }} defaultChecked></Switch>
            <span onClick={handleDownload} className='cursor-pointer'><FaDownload /></span>
          </div>


          <audio ref={audioRef} src={src} controls={false} hidden />

        </>
        : ""}
      <AlertMessage alertt={error} alertChange={setError} description={error.message} />

    </div>
  )
}
