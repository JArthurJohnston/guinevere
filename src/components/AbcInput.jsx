import { useRef, useState } from 'react'
import { EXAMPLES } from '../abc/examples'

export function AbcInput({ value, onChange }) {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragDepth = useRef(0)

  const loadFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(String(reader.result))
    reader.readAsText(file)
  }

  const handleFile = (e) => {
    loadFile(e.target.files?.[0])
    e.target.value = '' // allow re-selecting the same file
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    if (!e.dataTransfer.types.includes('Files')) return
    dragDepth.current += 1
    setIsDragging(true)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    dragDepth.current = Math.max(0, dragDepth.current - 1)
    if (dragDepth.current === 0) setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    dragDepth.current = 0
    setIsDragging(false)
    loadFile(e.dataTransfer.files?.[0])
  }

  return (
    <div className="abc-input">
      <div className="abc-input-toolbar">
        <button type="button" onClick={() => fileInputRef.current?.click()}>
          Upload .abc file
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".abc,text/plain"
          onChange={handleFile}
          hidden
        />
        <span className="toolbar-sep" />
        <span className="toolbar-label">Examples:</span>
        {EXAMPLES.map((ex) => (
          <button type="button" key={ex.name} onClick={() => onChange(ex.abc)}>
            {ex.name}
          </button>
        ))}
      </div>
      <div
        className={`abc-dropzone${isDragging ? ' dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <textarea
          className="abc-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste ABC notation here, upload a .abc file above, or drag one in..."
          spellCheck={false}
        />
        {isDragging && (
          <div className="abc-dropzone-overlay">
            <span>Drop .abc file to load</span>
          </div>
        )}
      </div>
    </div>
  )
}
