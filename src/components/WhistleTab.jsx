import { WhistleDiagram, RestMark } from './WhistleDiagram'

export function WhistleTab({ tune, instrument }) {
  if (!tune) {
    return <p className="empty-hint">Paste or upload some ABC notation above to see a tab here.</p>
  }

  const { header, measures } = tune

  if (measures.length === 0) {
    return <p className="empty-hint">No notes found in this tune (check that it has a melody line, not just chord symbols/lyrics).</p>
  }

  return (
    <div className="whistle-tab">
      <div className="tab-header">
        {header.title && <h2>{header.title}</h2>}
        <div className="tab-meta">
          {header.key && <span>Key: {header.key}</span>}
          {header.meter && <span>Meter: {header.meter}</span>}
          {header.tempo && <span>{header.tempo} bpm</span>}
        </div>
      </div>

      <div className="measures">
        {measures.map((measure, mi) => (
          <div className="measure" key={mi}>
            {measure.map((ev, ei) =>
              ev.type === 'rest' ? (
                <RestMark key={ei} instrument={instrument} />
              ) : (
                <WhistleDiagram key={ei} midi={ev.midi} instrument={instrument} />
              ),
            )}
          </div>
        ))}
      </div>

      <Legend />
    </div>
  )
}

function Legend() {
  return (
    <div className="legend">
      <div className="legend-item">
        <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7" className="hole hole-closed" /></svg>
        closed hole
      </div>
      <div className="legend-item">
        <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7" className="hole hole-open" /></svg>
        open hole
      </div>
      <div className="legend-item">
        <svg width="18" height="18" viewBox="0 0 18 18">
          <circle cx="9" cy="9" r="7" className="hole hole-open" />
          <path d="M 2 9 A 7 7 0 0 1 16 9 Z" className="hole-half-fill" />
        </svg>
        half hole
      </div>
      <div className="legend-item"><span className="legend-glyph">′ ″</span> 2nd / 3rd octave (which register the note is in)</div>
      <div className="legend-item"><span className="legend-glyph">↑ ⇈</span> overblow / hard overblow (blow harder to reach this note)</div>
      <div className="legend-item"><span className="legend-glyph">~</span> uncommon accidental (approximate)</div>
      <div className="legend-item"><span className="legend-glyph">!</span> not playable on this instrument (out of range, or not in a 5-hole instrument's scale)</div>
    </div>
  )
}
