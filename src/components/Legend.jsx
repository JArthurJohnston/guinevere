export function Legend() {
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
      <div className="legend-item"><span className="legend-glyph">alt</span> an alternate fingering exists — hover the note to see it</div>
    </div>
  )
}
