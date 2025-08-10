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
  }, [count])

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
    <div className='w-full max-w-md mx-auto'>
      {/* Main Audio Player Card */}
      <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/60 backdrop-blur-xl border border-neutral-700/50 rounded-3xl p-6 shadow-2xl">
        
        {/* Album Art Section */}
        <div className='relative mb-6 group'>
          <div className='aspect-square w-full bg-gradient-to-br from-neutral-800 to-neutral-700 rounded-2xl overflow-hidden shadow-lg'>
            <img 
              src="assets/d.jpg" 
              alt="Album Art" 
              className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' 
            />
            {/* Overlay gradient for better text visibility */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>
          </div>
          
          {/* Floating play button overlay */}
          <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            <Button 
              onClick={controlAudio}
              className='w-16 h-16 rounded-full bg-white/90 hover:bg-white text-black shadow-xl hover:scale-110 transition-all duration-300 backdrop-blur-sm'
            >
              {!play ? 
                <IoMdPlayCircle className="w-8 h-8" /> 
                : 
                <CiPause1 className="w-8 h-8" />
              }
            </Button>
          </div>
        </div>

        {/* Track Info */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-white mb-1">Processed Audio</h3>
          <p className="text-neutral-400 text-sm">
            {toggle ? 'Vocal Track' : 'Original Audio'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3 mb-6">
          <Progress 
            value={count / durInSec * 100} 
            className='w-full h-2 bg-neutral-700 rounded-full overflow-hidden'
          />
          
          {/* Time Display */}
          <div className='flex justify-between text-sm text-neutral-400 font-mono'>
            <span>{Math.floor(count / 60)}:{(count % 60).toString().padStart(2, '0')}</span>
            <span>{dur.min}:{dur.sec.toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* Control Section */}
        <div className='flex items-center justify-center mb-6'>
          <Button 
            onClick={controlAudio}
            className='w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105'
          >
            {!play ? 
              <IoMdPlayCircle className="w-7 h-7 text-white" /> 
              : 
              <CiPause1 className="w-7 h-7 text-white" />
            }
          </Button>
        </div>
      </div>

      {/* Controls Panel */}
      {vocalSrc && (
        <div className='mt-4 bg-gradient-to-r from-neutral-900/60 to-neutral-800/40 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-4'>
          <div className='flex items-center justify-between'>
            
            {/* Audio Source Toggle */}
            <div className='flex items-center gap-3'>
              <Label htmlFor='vocal' className="text-sm font-medium text-neutral-300">
                {toggle ? 'Vocals' : 'Original'}
              </Label>
              <Switch 
                onCheckedChange={() => setToggle(!toggle)} 
                defaultChecked 
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-600"
              />
            </div>

            {/* Download Button */}
            <Button
              onClick={handleDownload}
              variant="ghost"
              size="sm"
              className='text-neutral-400 hover:text-white hover:bg-neutral-700/50 rounded-xl transition-all duration-300 group'
            >
              <FaDownload className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            </Button>
          </div>
          
          {/* Track Type Indicator */}
          <div className="mt-3 flex justify-center">
            <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
              toggle 
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-300 border border-blue-500/30' 
                : 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-500/30'
            }`}>
              {toggle ? '🎤 Vocal Track' : '🎵 Original Audio'}
            </div>
          </div>
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={src} controls={false} hidden />
      
      {/* Alert Message */}
      <div className="mt-4">
        <AlertMessage alertt={error} alertChange={setError} description={error.message} />
      </div>
    </div>
  )
}