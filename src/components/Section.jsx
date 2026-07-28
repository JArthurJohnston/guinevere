import { useState } from 'react'

export function Section({ title, defaultOpen = true, right, children }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="section">
      <button
        type="button"
        className="section-header"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className={`section-chevron${open ? '' : ' collapsed'}`}>▾</span>
        <span className="section-title">{title}</span>
        {right && <span className="section-right">{right}</span>}
      </button>
      <div className="section-body" hidden={!open}>
        {children}
      </div>
    </section>
  )
}
