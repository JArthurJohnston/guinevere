import { useEffect, useRef, useState } from 'react'
import abcjs from 'abcjs'
import 'abcjs/abcjs-audio.css'

export function SynthPlayer({ tune }) {
  const containerRef = useRef(null)
  const controllerRef = useRef(null)
  const hasLoadedTuneRef = useRef(false)
  const [supported] = useState(() => abcjs.synth.supportsAudio())

  useEffect(() => {
    if (!supported || !containerRef.current) return
    const controller = new abcjs.synth.SynthController()
    controller.load(containerRef.current, null, {
      displayLoop: true,
      displayRestart: true,
      displayPlay: true,
      displayProgress: true,
      displayWarp: false,
    })
    controllerRef.current = controller
  }, [supported])

  useEffect(() => {
    if (!controllerRef.current || !tune) return
    
    // The first tune must load lazily (userAction: false) so we don't try to
    // resume the audio context before any user gesture has unlocked it.
    // Later tune changes need userAction: true, otherwise the controller's
    // isLoaded/midiBuffer state is never refreshed and play() keeps playing
    // whatever tune was loaded first.
    const isUserAction = hasLoadedTuneRef.current
    hasLoadedTuneRef.current = true
    controllerRef.current.setTune(tune, isUserAction).catch(() => {
      // e.g. the browser blocked audio until a user gesture - the play button still works
    })
  }, [tune])

  if (!supported) {
    return <p className="empty-hint">Audio playback isn’t supported in this browser.</p>
  }

  return <div className="synth-player" ref={containerRef} />
}
