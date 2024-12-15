

import './App.css'
import { InputFile } from './InputFile'

import { AudioCard } from './Audio'
import { useSelector } from 'react-redux'
import { RootState } from './redux/store'

function App() {
  const responseAudio = useSelector((s: RootState) => s.audioPlay.vocalAudioSrc)

  return (
    <>
      <div className='bg-neutral-950 h-screen w-full flex items-center justify-evenly flex-col'>
        <InputFile />
        <div className='mt-10 w-11/12 h-96 flex  gap-2  justify-around flex-wrap items-center box-border rounded-lg relative'>
          {responseAudio ?
            <AudioCard />
            : ""}

        </div>
       
      </div>
    </>
  )
}

export default App
