import './App.css'
import { InputFile } from './InputFile'

import { AudioCard } from './Audio'
import { useSelector } from 'react-redux'
import { RootState } from './redux/store'

function App() {
  const responseAudio = useSelector((s: RootState) => s.audioPlay.vocalAudioSrc)

  return (
    <>
      <div className='min-h-screen w-full bg-gradient-to-br from-slate-900 via-neutral-950 to-black flex flex-col items-center justify-center px-4 py-8'>
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Audio Processor
          </h1>
          <p className="text-neutral-400 text-lg max-w-md mx-auto">
            Upload your audio file and extract vocals with AI-powered processing
          </p>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-4xl mb-8">
          <InputFile />
        </div>

        {/* Audio Player Section */}
        <div className='w-full max-w-6xl flex justify-center items-center'>
          {responseAudio ? (
            <div className="animate-fade-in">
              <AudioCard />
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <svg className="w-12 h-12 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <p className="text-neutral-500 text-lg">
                Your processed audio will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App