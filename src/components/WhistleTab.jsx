import { WhistleDiagram, RestMark } from './WhistleDiagram'
import { Legend } from './Legend'

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
                <RestMark key={ei} instrument={instrument} duration={ev.duration} />
              ) : (
                <WhistleDiagram key={ei} midi={ev.midi} instrument={instrument} duration={ev.duration} />
              ),
            )}
          </div>
        ))}
      </div>

      <Legend />
    </div>
  )
}
