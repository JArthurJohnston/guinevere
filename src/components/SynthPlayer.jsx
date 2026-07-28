import { useEffect, useRef, useState } from 'react'
import abcjs from 'abcjs'
import 'abcjs/abcjs-audio.css'

export function SynthPlayer({ tune }) {
  const containerRef = useRef(null)
  const controllerRef = useRef(null)
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
    controllerRef.current.setTune(tune, false).catch(() => {
      // e.g. the browser blocked audio until a user gesture - the play button still works
    })
  }, [tune])

  if (!supported) {
    return <p className="empty-hint">Audio playback isn’t supported in this browser.</p>
  }

  return <div className="synth-player" ref={containerRef} />
}
