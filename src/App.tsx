import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { toPng } from 'html-to-image'

type Player = {
  id: number
  name: string
  initials: string
  club: string
  position: string
  age: number
  height: number
  score: number
  potential: number
  status: 'Monitorar' | 'Prioridade' | 'Observação'
  color: string
  metrics: number[]
}

const players: Player[] = [
  {
    id: 1,
    name: 'Bruno Antúnez',
    initials: 'BA',
    club: 'Boston River',
    position: 'Goleiro',
    age: 23,
    height: 182,
    score: 6.88,
    potential: 85,
    status: 'Prioridade',
    color: '#f0c469',
    metrics: [83, 76, 91, 69, 88, 62],
  },
  {
    id: 2,
    name: 'Franco Torgnascioli',
    initials: 'FT',
    club: 'Montevideo City',
    position: 'Goleiro',
    age: 36,
    height: 188,
    score: 6.82,
    potential: 72,
    status: 'Monitorar',
    color: '#69bff0',
    metrics: [78, 82, 73, 84, 66, 78],
  },
  {
    id: 3,
    name: 'Juan Moreno',
    initials: 'JM',
    club: 'Cerro Largo',
    position: 'Goleiro',
    age: 27,
    height: 194,
    score: 6.87,
    potential: 79,
    status: 'Monitorar',
    color: '#b382f0',
    metrics: [69, 88, 81, 72, 78, 85],
  },
  {
    id: 4,
    name: 'Lucas Acosta',
    initials: 'LA',
    club: 'Sarmiento',
    position: 'Goleiro',
    age: 28,
    height: 187,
    score: 6.73,
    potential: 67,
    status: 'Observação',
    color: '#ef877c',
    metrics: [65, 74, 72, 78, 69, 71],
  },
  {
    id: 5,
    name: 'Ignacio Suárez',
    initials: 'IS',
    club: 'Nacional',
    position: 'Goleiro',
    age: 22,
    height: 186,
    score: 6.65,
    potential: 88,
    status: 'Prioridade',
    color: '#83d09a',
    metrics: [74, 68, 86, 65, 82, 71],
  },
]

const radarLabels = ['Reflexo', '1×1', 'Jogo aéreo', 'Reposição', 'Posicionamento', 'Defesas']

function Icon({
  children,
  size = 18,
  className = '',
}: {
  children: ReactNode
  size?: number
  className?: string
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  )
}

const icons = {
  grid: (
    <Icon>
      <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" stroke="currentColor" strokeWidth="1.7" />
    </Icon>
  ),
  users: (
    <Icon>
      <path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 20v-2a4 4 0 0 0-3-3.87M16 2.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </Icon>
  ),
  chart: (
    <Icon>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </Icon>
  ),
  bookmark: (
    <Icon>
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
    </Icon>
  ),
  upload: (
    <Icon>
      <path d="M12 16V4M7 9l5-5 5 5M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </Icon>
  ),
  download: (
    <Icon>
      <path d="M12 3v12M7 10l5 5 5-5M4 20h16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </Icon>
  ),
  search: (
    <Icon>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
      <path d="m20 20-4-4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </Icon>
  ),
  spark: (
    <Icon>
      <path d="m12 2 1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
    </Icon>
  ),
  more: (
    <Icon>
      <circle cx="5" cy="12" fill="currentColor" r="1.5" />
      <circle cx="12" cy="12" fill="currentColor" r="1.5" />
      <circle cx="19" cy="12" fill="currentColor" r="1.5" />
    </Icon>
  ),
  chevron: (
    <Icon size={16}>
      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </Icon>
  ),
  arrow: (
    <Icon size={16}>
      <path d="m5 12 4 4L19 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </Icon>
  ),
  sun: (
    <Icon size={14}>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M17.66 6.34l-1.41-1.41" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </Icon>
  ),
  moon: (
    <Icon size={14}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </Icon>
  ),
}

function RadarChart({ values }: { values: number[] }) {
  const center = 120
  const radius = 82
  const point = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / values.length - Math.PI / 2
    const distance = radius * (value / 100)
    return `${center + Math.cos(angle) * distance},${center + Math.sin(angle) * distance}`
  }
  const rings = [0.25, 0.5, 0.75, 1]

  return (
    <svg className="radar" viewBox="0 0 240 240">
      {rings.map((ring) => (
        <polygon
          className="radar-ring"
          key={ring}
          points={values.map((_, index) => point(index, ring * 100)).join(' ')}
        />
      ))}
      {values.map((_, index) => (
        <line
          className="radar-line"
          key={index}
          x1={center}
          x2={point(index, 100).split(',')[0]}
          y1={center}
          y2={point(index, 100).split(',')[1]}
        />
      ))}
      <polygon className="radar-shape" points={values.map((value, index) => point(index, value)).join(' ')} />
      {values.map((value, index) => {
        const [cx, cy] = point(index, value).split(',')
        return <circle className="radar-dot" cx={cx} cy={cy} key={index} r="3" />
      })}
      {radarLabels.map((label, index) => {
        const [x, y] = point(index, 122).split(',')
        return (
          <text className="radar-label" dominantBaseline="middle" key={label} textAnchor="middle" x={x} y={y}>
            {label}
          </text>
        )
      })}
    </svg>
  )
}

function MiniTrend({ values, color = '#d7ff67' }: { values: number[]; color?: string }) {
  const points = values
    .map((value, index) => `${(index / (values.length - 1)) * 120},${40 - (value / 100) * 32}`)
    .join(' ')
  return (
    <svg aria-label="Evolução da métrica" className="mini-trend" viewBox="0 0 120 44">
      <polyline fill="none" points={points} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  )
}

function PlayersDirectoryPage({
  shortlistOnly = false,
  onOpenPlayer,
}: {
  shortlistOnly?: boolean
  onOpenPlayer: (playerId: number) => void
}) {
  const sourcePlayers = shortlistOnly ? players.filter((player) => player.status === 'Prioridade') : players
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('Todos')
  const [selectedId, setSelectedId] = useState(sourcePlayers[0]?.id ?? 1)

  const filtered = sourcePlayers.filter(
    (player) =>
      (status === 'Todos' || player.status === status) &&
      `${player.name} ${player.club} ${player.position}`.toLowerCase().includes(search.toLowerCase()),
  )
  const selected = sourcePlayers.find((player) => player.id === selectedId) ?? sourcePlayers[0]

  return (
    <section className="directory-page">
      <div className="directory-heading">
        <div>
          <span className="eyebrow">{shortlistOnly ? 'RECRUTAMENTO / SHORTLIST' : 'BASE DE DADOS / JOGADORES'}</span>
          <h1>{shortlistOnly ? 'Shortlist' : 'Jogadores'}</h1>
          <p>
            {shortlistOnly
              ? 'Atletas selecionados para acompanhamento e tomada de decisão.'
              : 'Consulte, compare e organize todos os jogadores da sua base.'}
          </p>
        </div>
        <button className="directory-action">{shortlistOnly ? 'Exportar lista' : '+ Adicionar jogador'}</button>
      </div>

      <div className="directory-kpis">
        <div><span>{shortlistOnly ? 'NA SHORTLIST' : 'TOTAL DE JOGADORES'}</span><strong>{sourcePlayers.length}</strong></div>
        <div><span>IDADE MÉDIA</span><strong>{Math.round(sourcePlayers.reduce((sum, player) => sum + player.age, 0) / sourcePlayers.length)}</strong></div>
        <div><span>NOTA MÉDIA</span><strong>{(sourcePlayers.reduce((sum, player) => sum + player.score, 0) / sourcePlayers.length).toFixed(2).replace('.', ',')}</strong></div>
        <div><span>ALTA PRIORIDADE</span><strong>{sourcePlayers.filter((player) => player.status === 'Prioridade').length}</strong></div>
      </div>

      <div className="directory-layout">
        <section className="directory-list panel">
          <div className="directory-toolbar">
            <label className="directory-search">{icons.search}<input onChange={(event) => setSearch(event.target.value)} placeholder="Buscar nome, clube ou posição" value={search} /></label>
            <select onChange={(event) => setStatus(event.target.value)} value={status}>
              <option>Todos</option>
              <option>Prioridade</option>
              <option>Monitorar</option>
              <option>Observação</option>
            </select>
            <select defaultValue="Nota">
              <option>Nota</option>
              <option>Potencial</option>
              <option>Idade</option>
            </select>
          </div>
          <div className="directory-count"><span>{filtered.length} jogadores</span><span>ÚLTIMA ATUALIZAÇÃO · HOJE</span></div>
          <div className="directory-rows">
            {filtered.map((player) => (
              <button
                className={selected?.id === player.id ? 'directory-row active' : 'directory-row'}
                key={player.id}
                onClick={() => setSelectedId(player.id)}
              >
                <div className="avatar" style={{ '--avatar-color': player.color } as React.CSSProperties}>{player.initials}</div>
                <div className="directory-player"><strong>{player.name}</strong><span>{player.club} · {player.position}</span></div>
                <div className="directory-meta"><span>IDADE</span><strong>{player.age}</strong></div>
                <div className="directory-meta"><span>ALTURA</span><strong>{player.height} cm</strong></div>
                <div className="directory-rating"><span>NOTA</span><strong>{player.score.toFixed(2).replace('.', ',')}</strong></div>
                <span className={`status status-${player.status.toLowerCase()}`}>{player.status}</span>
                {icons.chevron}
              </button>
            ))}
            {filtered.length === 0 && <div className="evaluation-empty">Nenhum jogador encontrado.</div>}
          </div>
        </section>

        {selected && (
          <aside className="directory-preview">
            <div className="preview-top">
              <span className="eyebrow">VISUALIZAÇÃO RÁPIDA</span>
              <button aria-label="Mais opções">{icons.more}</button>
            </div>
            <div className="preview-player">
              <div className="avatar avatar-large" style={{ '--avatar-color': selected.color } as React.CSSProperties}>{selected.initials}</div>
              <div><h2>{selected.name}</h2><p>{selected.club} · {selected.position}</p></div>
            </div>
            <RadarChart values={selected.metrics} />
            <div className="preview-score">
              <div><span>NOTA</span><strong>{selected.score.toFixed(2).replace('.', ',')}</strong></div>
              <div><span>POTENCIAL</span><strong>{selected.potential}</strong></div>
              <div><span>IDADE</span><strong>{selected.age}</strong></div>
            </div>
            <div className="preview-highlights">
              <span>PRINCIPAIS DESTAQUES</span>
              {selected.metrics
                .map((value, index) => ({ value, label: radarLabels[index] }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 3)
                .map((metric) => <div key={metric.label}><span>{metric.label}</span><strong>{metric.value}º pct</strong></div>)}
            </div>
            <button className="full-profile" onClick={() => onOpenPlayer(selected.id)}>Abrir ficha completa {icons.chevron}</button>
          </aside>
        )}
      </div>
    </section>
  )
}

const playerMetrics = [
  { label: '% defesas difíceis', value: '0,77', percentile: 85, group: 'Defesa' },
  { label: 'Expected Goals Prevented xGP', value: '0,44', percentile: 95, group: 'Defesa' },
  { label: 'xG defendidos / 90', value: '0,54', percentile: 95, group: 'Defesa' },
  { label: 'Índice de impacto do goleiro', value: '29,64', percentile: 75, group: 'Defesa' },
  { label: 'Bolas difíceis para sofrer 1 gol', value: '4,30', percentile: 85, group: 'Defesa' },
  { label: '% defesas seguras', value: '0,20', percentile: 35, group: 'Defesa' },
  { label: '% jogos sem sofrer gol', value: '0,42', percentile: 65, group: 'Defesa' },
  { label: 'Diferença defesas esperadas / feitas', value: '0,10', percentile: 85, group: 'Defesa' },
  { label: 'Falhas', value: '0', percentile: 60, group: 'Defesa' },
  { label: '% acerto do goleiro', value: '0,71', percentile: 45, group: 'Defesa' },
  { label: '% acerto nas saídas do gol', value: '0', percentile: 15, group: 'Aéreo' },
  { label: 'Saídas do gol com sucesso /90', value: '0', percentile: 15, group: 'Aéreo' },
  { label: '% passes certos', value: '0,73', percentile: 45, group: 'Distribuição' },
  { label: 'Defesas / 90', value: '3,84', percentile: 75, group: 'Defesa' },
]

const rawDataGroups = [
  {
    title: 'Identificação e contrato',
    count: 12,
    rows: [
      ['Nacionalidade', 'Uruguai'], ['Pé preferido', 'Direito'], ['Salário', 'R$ 85,5 mil'],
      ['Valor estimado', 'R$ 9–85 mi'], ['Fim de contrato', '31/12/2027'], ['País atual', 'Uruguai'],
    ],
  },
  {
    title: 'Participação e tempo',
    count: 6,
    rows: [
      ['Minutos', '2.593 min'], ['Jogos completos', '28,81'], ['Média de jogos', '37,31'],
      ['Sofridos / jogo', '0,69'], ['Titular', '29 jogos'], ['Man of the match', '3 jogos'],
    ],
  },
  {
    title: 'Goleiro e defesas',
    count: 10,
    rows: [
      ['Defesas realizadas', '104'], ['Gols sofridos', '20'], ['Penáltis defendidos', '0'],
      ['Defesas esperadas', '0,90%'], ['xGP', '0,44'], ['Posse ganha /90', '2,80'],
    ],
  },
]

function PlayerFullProfile({ player, onBack }: { player: Player; onBack: () => void }) {
  const [metricGroup, setMetricGroup] = useState('Todas')
  const [openGroups, setOpenGroups] = useState<string[]>([rawDataGroups[0].title])
  const visibleMetrics = metricGroup === 'Todas'
    ? playerMetrics
    : playerMetrics.filter((metric) => metric.group === metricGroup)
  const strengths = playerMetrics.filter((metric) => metric.percentile >= 85).slice(0, 4)
  const attention = playerMetrics.filter((metric) => metric.percentile <= 20)

  const toggleGroup = (title: string) => {
    setOpenGroups((current) =>
      current.includes(title) ? current.filter((item) => item !== title) : [...current, title],
    )
  }

  return (
    <section className="full-player-page">
      <button className="player-back" onClick={onBack}>← Todos os jogadores</button>

      <header className="player-hero">
        <div className="player-hero-main">
          <div className="avatar player-hero-avatar" style={{ '--avatar-color': player.color } as React.CSSProperties}>{player.initials}</div>
          <div>
            <span className="eyebrow">FICHA INDIVIDUAL / GOLEIRO</span>
            <h1>{player.name}</h1>
            <p>{player.club} · Uruguai · Pé direito</p>
          </div>
        </div>
        <div className="hero-actions">
          <button className="secondary-button">{icons.bookmark} Adicionar à shortlist</button>
          <button className="directory-action">{icons.more}</button>
        </div>
        <div className="player-hero-stats">
          <div><span>NOTA GERAL</span><strong>{player.score.toFixed(2).replace('.', ',')}</strong><small>Top 18% da posição</small></div>
          <div><span>POTENCIAL</span><strong>{player.potential}</strong><small>Acima da média</small></div>
          <div><span>IDADE</span><strong>{player.age}</strong><small>85º percentil</small></div>
          <div><span>ALTURA</span><strong>{(player.height / 100).toFixed(2).replace('.', ',')} m</strong><small>35º percentil</small></div>
          <div><span>AMOSTRA</span><strong>2.593'</strong><small>29 partidas</small></div>
        </div>
      </header>

      <div className="player-analysis-grid">
        <article className="analysis-radar panel">
          <div className="block-heading">
            <div><span className="eyebrow">PERFIL DE DESEMPENHO</span><h2>Radar por percentil</h2></div>
            <span className="sample-label">BASE · 10 GOLEIROS</span>
          </div>
          <RadarChart values={player.metrics} />
          <div className="radar-caption"><span>0</span><i /><span>Percentil dentro da posição</span><i /><span>100</span></div>
        </article>

        <article className="quick-read panel">
          <div className="block-heading">
            <div><span className="eyebrow">LEITURA RÁPIDA</span><h2>Pontos decisivos</h2></div>
          </div>
          <div className="read-section positive">
            <div className="read-title"><span>DESTAQUES</span><strong>{strengths.length}</strong></div>
            {strengths.map((metric) => (
              <div className="read-row" key={metric.label}><span>{metric.label}</span><strong>{metric.percentile}º</strong></div>
            ))}
          </div>
          <div className="read-section attention">
            <div className="read-title"><span>PONTOS DE ATENÇÃO</span><strong>{attention.length}</strong></div>
            {attention.map((metric) => (
              <div className="read-row" key={metric.label}><span>{metric.label}</span><strong>{metric.percentile}º</strong></div>
            ))}
          </div>
          <div className="scout-observation">
            <span>NOTA DO SCOUT</span>
            <p>Goleiro de boa leitura e ótima capacidade de evitar gols. Exige acompanhamento nas saídas aéreas.</p>
          </div>
        </article>
      </div>

      <section className="performance-section">
        <div className="performance-heading">
          <div><span className="eyebrow">AVALIAÇÃO DA POSIÇÃO</span><h2>14 métricas principais</h2></div>
          <div className="metric-tabs">
            {['Todas', 'Defesa', 'Aéreo', 'Distribuição'].map((group) => (
              <button className={metricGroup === group ? 'active' : ''} key={group} onClick={() => setMetricGroup(group)}>{group}</button>
            ))}
          </div>
        </div>
        <div className="performance-table">
          <div className="performance-table-head"><span>MÉTRICA</span><span>VALOR</span><span>PERCENTIL NA POSIÇÃO</span><span>PCT</span></div>
          {visibleMetrics.map((metric) => (
            <div className="performance-row" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <div className="percentile-track"><i className={metric.percentile <= 20 ? 'low' : ''} style={{ width: `${metric.percentile}%` }} /></div>
              <b className={metric.percentile <= 20 ? 'low' : metric.percentile >= 75 ? 'high' : ''}>{metric.percentile}º</b>
            </div>
          ))}
        </div>
      </section>

      <section className="comparison-section panel">
        <div className="block-heading">
          <div><span className="eyebrow">CONTEXTO DO ELENCO</span><h2>Identificação e físico</h2></div>
          <span className="sample-label">10 JOGADORES NO GRUPO</span>
        </div>
        <div className="comparison-grid">
          {[
            { label: 'Idade', value: `${player.age} anos`, pct: 85, note: 'Mais jovem', range: '22 — 38' },
            { label: 'Altura', value: `${(player.height / 100).toFixed(2).replace('.', ',')} m`, pct: 35, note: 'Próximo da média', range: '1,80 — 1,94' },
            { label: 'Nota média', value: player.score.toFixed(2).replace('.', ','), pct: 65, note: 'Acima da média', range: '6,75 — 7,08' },
            { label: 'Jogos completos', value: '28,81', pct: 15, note: 'Baixa amostra', range: '28,56 — 51,33' },
          ].map((item) => (
            <article className="comparison-card" key={item.label}>
              <div><span>{item.label}</span><b className={item.pct <= 20 ? 'low' : ''}>{item.pct}º pct</b></div>
              <strong>{item.value}</strong>
              <p>{item.note}</p>
              <div className="comparison-bar"><i className={item.pct <= 20 ? 'low' : ''} style={{ width: `${item.pct}%` }} /></div>
              <small>FAIXA DO GRUPO · {item.range}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="raw-data-section panel">
        <div className="block-heading">
          <div><span className="eyebrow">PLANILHA ORIGINAL</span><h2>Dados completos</h2><p>141 colunas organizadas por categoria.</p></div>
          <button className="secondary-button">Exportar dados</button>
        </div>
        <div className="raw-tabs">
          {rawDataGroups.map((group) => <span key={group.title}>{group.title}<b>{group.count}</b></span>)}
        </div>
        <div className="raw-groups">
          {rawDataGroups.map((group) => {
            const isOpen = openGroups.includes(group.title)
            return (
              <article className="raw-group" key={group.title}>
                <button onClick={() => toggleGroup(group.title)}>
                  <span>{group.title}<b>{group.count} colunas</b></span>
                  <i>{isOpen ? '−' : '+'}</i>
                </button>
                {isOpen && (
                  <div className="raw-grid">
                    {group.rows.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>
    </section>
  )
}

function ImportModal({ onClose }: { onClose: () => void }) {
  const [fileName, setFileName] = useState('')

  const receiveFile = (file?: File) => {
    if (file) setFileName(file.name)
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section aria-labelledby="import-title" aria-modal="true" className="import-modal" onMouseDown={(event) => event.stopPropagation()} role="dialog">
        <div className="import-modal-header">
          <div><span className="eyebrow">IMPORTAR DADOS</span><h2 id="import-title">Adicionar planilha</h2></div>
          <button aria-label="Fechar" onClick={onClose}>×</button>
        </div>
        <p className="import-description">Envie um arquivo CSV ou Excel. Cada aba pode representar um perfil de posição diferente.</p>
        <label
          className={fileName ? 'drop-zone has-file' : 'drop-zone'}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault()
            receiveFile(event.dataTransfer.files[0])
          }}
        >
          <input accept=".csv,.xlsx,.xls" onChange={(event) => receiveFile(event.target.files?.[0])} type="file" />
          <span className="drop-icon">{fileName ? icons.arrow : icons.upload}</span>
          <strong>{fileName || 'Arraste sua planilha para cá'}</strong>
          <p>{fileName ? 'Arquivo pronto para importação' : 'ou clique para escolher um arquivo'}</p>
          {!fileName && <small>CSV, XLS ou XLSX · máximo de 25 MB</small>}
        </label>
        <div className="import-info">
          <span>01</span><p><strong>Mapeamento inteligente</strong>Você poderá revisar todas as colunas antes de concluir a importação.</p>
        </div>
        <div className="import-modal-actions">
          <button className="secondary-button" onClick={onClose}>Cancelar</button>
          <button className="save-button" disabled={!fileName} onClick={onClose}>Continuar para mapeamento</button>
        </div>
      </section>
    </div>
  )
}

const identificationFields = [
  { label: 'Nome do jogador', value: 'Jogador', required: true },
  { label: 'Clube', value: 'Equipe' },
  { label: 'Idade', value: 'Idade' },
  { label: 'Pé preferido', value: 'Pé preferido' },
  { label: 'Nacionalidade', value: 'NAC' },
  { label: 'Altura', value: 'Altura' },
  { label: 'Salário', value: 'Salário' },
  { label: 'Nota média', value: 'Nota média' },
  { label: 'Jogos completos', value: 'Jogos completos' },
]

const initialEvaluations = [
  { metric: 'Desarmes ganhos/90', lower: false },
  { metric: '% Desarmes ganhos', lower: false },
  { metric: 'Interceptações/90', lower: false },
  { metric: 'Erros defensivos/90', lower: true },
  { metric: 'Taxa de acerto', lower: false },
  { metric: 'Cabeceios ganhos/90', lower: false },
  { metric: '% Cabeceios ganhos', lower: false },
  { metric: 'Remates bloqueados/90', lower: false },
  { metric: 'Bolas disputadas e ganhas/90', lower: false },
  { metric: '% Bolas disputadas e ganhas', lower: false },
  { metric: 'Passes certos/90', lower: false },
  { metric: '% Passes certos', lower: false },
  { metric: 'Passes progressivos/90', lower: false },
  { metric: 'Perdas de bola/90', lower: true },
]

function PlayersSetupPage() {
  const [evaluationQuery, setEvaluationQuery] = useState('')
  const [evaluations, setEvaluations] = useState(initialEvaluations)
  const [saved, setSaved] = useState(false)

  const visibleEvaluations = evaluations
    .map((evaluation, index) => ({ ...evaluation, index }))
    .filter((evaluation) => evaluation.metric.toLowerCase().includes(evaluationQuery.toLowerCase()))

  const toggleDirection = (index: number) => {
    setSaved(false)
    setEvaluations((current) =>
      current.map((evaluation, evaluationIndex) =>
        evaluationIndex === index ? { ...evaluation, lower: !evaluation.lower } : evaluation,
      ),
    )
  }

  return (
    <section className="setup-page">
      <div className="setup-heading">
        <div>
          <span className="eyebrow">JOGADORES / CONFIGURAÇÃO</span>
          <h1>Perfil de posição</h1>
          <p>Mapeie as colunas da planilha e defina os critérios usados na análise.</p>
        </div>
        <div className="setup-actions">
          <span className="setup-status"><i />9 campos mapeados</span>
          <button className="secondary-button">Cancelar</button>
          <button
            className={saved ? 'save-button saved' : 'save-button'}
            onClick={() => setSaved(true)}
          >
            {saved ? icons.arrow : null}
            {saved ? 'Configuração salva' : 'Salvar configuração'}
          </button>
        </div>
      </div>

      <div className="setup-layout">
        <div className="setup-main">
          <section className="config-section">
            <div className="section-number">01</div>
            <div className="section-content">
              <div className="section-title">
                <div><h2>Tipo de jogador</h2><p>Este perfil será usado para agrupar e comparar jogadores.</p></div>
                <span className="required-label">OBRIGATÓRIO</span>
              </div>
              <label className="form-field profile-type-field">
                <span>Nome do perfil</span>
                <input defaultValue="Zagueiros" />
              </label>
            </div>
          </section>

          <section className="config-section">
            <div className="section-number">02</div>
            <div className="section-content">
              <div className="section-title">
                <div><h2>Identificação</h2><p>Associe as informações básicas do jogador às colunas da planilha.</p></div>
                <span className="completion-count">9 / 9</span>
              </div>
              <div className="identification-grid">
                {identificationFields.map((field) => (
                  <label className="form-field" key={field.label}>
                    <span>{field.label}{field.required && <b> *</b>}</span>
                    <select defaultValue={field.value}>
                      <option>{field.value}</option>
                      <option>— Não mapear —</option>
                    </select>
                  </label>
                ))}
                <label className="form-field">
                  <span>UID / Foto do jogador</span>
                  <select defaultValue="">
                    <option value="">— Escolher coluna —</option>
                    <option>UID</option>
                  </select>
                </label>
              </div>
            </div>
          </section>

          <section className="config-section evaluations-section">
            <div className="section-number">03</div>
            <div className="section-content">
              <div className="section-title">
                <div><h2>As 14 avaliações</h2><p>Defina o nome de exibição e a direção de cada indicador.</p></div>
                <span className="completion-count">14 / 14</span>
              </div>
              <div className="evaluation-tools">
                <label className="evaluation-search">
                  {icons.search}
                  <input
                    onChange={(event) => setEvaluationQuery(event.target.value)}
                    placeholder="Pesquisar avaliação"
                    value={evaluationQuery}
                  />
                </label>
                <div className="direction-legend"><span>VALOR ALTO É MELHOR</span><span>VALOR BAIXO É MELHOR</span></div>
              </div>
              <div className="evaluation-list">
                <div className="evaluation-header">
                  <span>#</span><span>COLUNA DA PLANILHA</span><span>NOME NA FICHA</span><span>DIREÇÃO</span>
                </div>
                {visibleEvaluations.map((evaluation) => (
                  <div className="evaluation-row" key={evaluation.index}>
                    <span className="evaluation-index">{String(evaluation.index + 1).padStart(2, '0')}</span>
                    <select defaultValue={evaluation.metric}>
                      <option>{evaluation.metric}</option>
                    </select>
                    <input defaultValue={evaluation.metric} />
                    <label className="direction-toggle">
                      <input
                        checked={evaluation.lower}
                        onChange={() => toggleDirection(evaluation.index)}
                        type="checkbox"
                      />
                      <span className="toggle-track"><i /></span>
                      <b>{evaluation.lower ? 'Menor' : 'Maior'}</b>
                    </label>
                  </div>
                ))}
                {visibleEvaluations.length === 0 && (
                  <div className="evaluation-empty">Nenhuma avaliação encontrada.</div>
                )}
              </div>
            </div>
          </section>
        </div>

        <aside className="setup-summary">
          <span className="eyebrow">RESUMO DO PERFIL</span>
          <h3>Zagueiros</h3>
          <div className="summary-line"><span>Identificação</span><strong>9 campos</strong></div>
          <div className="summary-line"><span>Avaliações</span><strong>14 métricas</strong></div>
          <div className="summary-line"><span>Menor é melhor</span><strong>{evaluations.filter((item) => item.lower).length}</strong></div>
          <div className="summary-divider" />
          <div className="summary-note">
            <span>Como funciona</span>
            <p>Os jogadores serão comparados apenas com atletas deste mesmo perfil de posição.</p>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default function App() {
  const [selectedId, setSelectedId] = useState(1)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Todos')
  const [tab, setTab] = useState('Visão geral')
  const [mobileNav, setMobileNav] = useState(false)
  const [activePage, setActivePage] = useState<'dashboard' | 'players' | 'profiles' | 'shortlist' | 'player'>('dashboard')
  const [isExporting, setIsExporting] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  useEffect(() => {
    const stored = localStorage.getItem('scoutboard-theme') as 'light' | 'dark' | null
    if (stored) setTheme(stored)
  }, [])

  useEffect(() => {
    localStorage.setItem('scoutboard-theme', theme)
    document.documentElement.dataset.theme = theme
  }, [theme])

  const selected = players.find((player) => player.id === selectedId) ?? players[0]
  const filteredPlayers = useMemo(
    () =>
      players.filter(
        (player) =>
          (filter === 'Todos' || player.status === filter) &&
          `${player.name} ${player.club}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [filter, query],
  )

  const downloadFullPage = async () => {
    const app = document.querySelector<HTMLElement>('.app-shell')
    if (!app || isExporting) return

    setIsExporting(true)
    const previousScroll = window.scrollY
    window.scrollTo({ top: 0 })

    try {
      await document.fonts.ready
      const width = app.scrollWidth
      const height = app.scrollHeight
      const dataUrl = await toPng(app, {
        backgroundColor: '#f2f2ef',
        cacheBust: true,
        canvasHeight: height * 1.5,
        canvasWidth: width * 1.5,
        filter: (node) => !(node instanceof HTMLElement && node.dataset.exportIgnore === 'true'),
        height,
        pixelRatio: 1.5,
        width,
      })
      const link = document.createElement('a')
      const pageName = {
        dashboard: 'visao-geral',
        players: 'jogadores',
        profiles: 'perfis-de-posicao',
        shortlist: 'shortlist',
        player: 'ficha-do-jogador',
      }[activePage]
      link.download = `scoutboard-${pageName}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Não foi possível exportar a tela.', error)
      window.alert('Não foi possível baixar a tela. Tente novamente.')
    } finally {
      window.scrollTo({ top: previousScroll })
      setIsExporting(false)
    }
  }

  return (
    <div className="app-shell" data-theme={theme}>
      <aside className={mobileNav ? 'sidebar sidebar-open' : 'sidebar'}>
        <div className="brand">
          <div className="brand-mark">SB</div>
          <span>Scoutboard</span>
        </div>
        <nav className="nav-list">
          <button className={activePage === 'dashboard' ? 'nav-item nav-active' : 'nav-item'} onClick={() => { setActivePage('dashboard'); setMobileNav(false) }}>{icons.grid}<span>Visão geral</span></button>
          <button className={activePage === 'players' || activePage === 'player' ? 'nav-item nav-active' : 'nav-item'} onClick={() => { setActivePage('players'); setMobileNav(false) }}>{icons.users}<span>Jogadores</span><b>10</b></button>
          <button className={activePage === 'profiles' ? 'nav-item nav-active' : 'nav-item'} onClick={() => { setActivePage('profiles'); setMobileNav(false) }}>{icons.chart}<span>Perfis de posição</span></button>
          <button className={activePage === 'shortlist' ? 'nav-item nav-active' : 'nav-item'} onClick={() => { setActivePage('shortlist'); setMobileNav(false) }}>{icons.bookmark}<span>Shortlist</span><b>4</b></button>
        </nav>
        <div className="workspace-card">
          <div className="workspace-icon">{icons.upload}</div>
          <div>
            <strong>Base FM 2026</strong>
            <span>Atualizada hoje</span>
          </div>
          <button aria-label="Mais opções">{icons.more}</button>
        </div>
        <div className="sidebar-profile">
          <div className="avatar avatar-small">MA</div>
          <div><strong>Marcos Almeida</strong><span>Head Scout</span></div>
          <button aria-label="Mais opções">{icons.more}</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button aria-label="Abrir menu" className="mobile-menu" onClick={() => setMobileNav((value) => !value)}>
            <span />
            <span />
          </button>
          <div className="breadcrumb"><span>Scoutboard</span><i>/</i><strong>{{
            dashboard: 'Visão geral',
            players: 'Jogadores',
            profiles: 'Perfis de posição',
            shortlist: 'Shortlist',
            player: selected.name,
          }[activePage]}</strong></div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Buscar">{icons.search}</button>
            <button
              className="icon-button"
              aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
              onClick={toggleTheme}
              title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
            >
              {theme === 'light' ? icons.moon : icons.sun}
            </button>
            <button
              className="download-button"
              data-export-ignore="true"
              disabled={isExporting}
              onClick={downloadFullPage}
            >
              {icons.download}
              <span>{isExporting ? 'Gerando PNG…' : 'Baixar tela'}</span>
            </button>
            <button className="import-button" onClick={() => setShowImport(true)}>{icons.upload}<span>Importar planilha</span></button>
          </div>
        </header>

        <div className={activePage === 'profiles' ? 'content content-setup' : 'content'}>
          {activePage === 'dashboard' ? (
          <>
          <section className="intro">
            <div>
              <span className="eyebrow">SCOUTING / TEMPORADA 2025–26</span>
              <h1>Visão geral</h1>
              <p>Acompanhe jogadores, avaliações e prioridades do departamento.</p>
            </div>
            <div className="updated"><span className="live-dot" />BASE ATUALIZADA HÁ 12 MIN</div>
          </section>

          <section className="stats-grid">
            <article className="stat-card stat-featured">
              <div className="stat-top"><span>Jogadores analisados</span><span className="trend-positive">↗ 12%</span></div>
              <strong>148</strong>
              <div className="stat-foot"><div className="avatar-stack"><span>BA</span><span>IS</span><span>JM</span></div><span>+18 este mês</span></div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span>Em observação</span><span className="metric-icon">{icons.search}</span></div>
              <strong>32</strong>
              <div className="progress"><i style={{ width: '64%' }} /></div>
              <div className="stat-foot"><span>64% da meta mensal</span><b>50</b></div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span>Na shortlist</span><span className="metric-icon">{icons.bookmark}</span></div>
              <strong>12</strong>
              <div className="stat-foot"><span>4 com alta prioridade</span><span className="mini-avatars"><i /><i /><i /></span></div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span>Nota média</span><span className="trend-positive">↗ 0,4</span></div>
              <strong>7,24</strong>
              <MiniTrend values={[35, 38, 34, 56, 51, 68, 72, 82]} />
            </article>
          </section>

          <div className="dashboard-grid">
            <section className="players-panel panel">
              <div className="panel-heading">
                <div><span className="eyebrow">LISTA DE TRABALHO</span><h2>Jogadores em destaque</h2></div>
                <button className="text-button">Ver todos {icons.chevron}</button>
              </div>
              <div className="filters">
                <label className="search-field">{icons.search}<input aria-label="Buscar jogador" onChange={(event) => setQuery(event.target.value)} placeholder="Buscar jogador ou clube" value={query} /></label>
                <div className="filter-pills">
                  {['Todos', 'Prioridade', 'Monitorar'].map((item) => (
                    <button className={filter === item ? 'pill active' : 'pill'} key={item} onClick={() => setFilter(item)}>{item}</button>
                  ))}
                </div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>JOGADOR</th><th>IDADE</th><th>NOTA</th><th>POTENCIAL</th><th>STATUS</th><th /></tr></thead>
                  <tbody>
                    {filteredPlayers.map((player) => (
                      <tr className={selected.id === player.id ? 'selected-row' : ''} key={player.id} onClick={() => setSelectedId(player.id)}>
                        <td><div className="player-cell"><div className="avatar" style={{ '--avatar-color': player.color } as React.CSSProperties}>{player.initials}</div><div><strong>{player.name}</strong><span>{player.club} · {player.position}</span></div></div></td>
                        <td>{player.age}</td>
                        <td><strong className="score">{player.score.toFixed(2).replace('.', ',')}</strong></td>
                        <td><div className="potential"><i><b style={{ width: `${player.potential}%` }} /></i><span>{player.potential}</span></div></td>
                        <td><span className={`status status-${player.status.toLowerCase()}`}>{player.status}</span></td>
                        <td><button aria-label={`Abrir ${player.name}`} className="row-arrow">{icons.chevron}</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredPlayers.length === 0 && <div className="empty-state">Nenhum jogador encontrado com esses filtros.</div>}
              </div>
            </section>

            <aside className="profile-panel panel">
              <div className="profile-header">
                <span className="eyebrow">RELATÓRIO DO JOGADOR</span>
                <button aria-label="Mais opções">{icons.more}</button>
              </div>
              <div className="profile-identity">
                <div className="avatar avatar-large" style={{ '--avatar-color': selected.color } as React.CSSProperties}>{selected.initials}</div>
                <div><h2>{selected.name}</h2><p>{selected.club} · {selected.position}</p></div>
                <button className="bookmark-button" aria-label="Adicionar à shortlist">{icons.bookmark}</button>
              </div>
              <div className="profile-tabs">
                {['Visão geral', 'Métricas', 'Histórico'].map((item) => <button className={tab === item ? 'active' : ''} key={item} onClick={() => setTab(item)}>{item}</button>)}
              </div>

              {tab === 'Visão geral' && (
                <>
                  <div className="radar-wrap"><RadarChart values={selected.metrics} /></div>
                  <div className="profile-numbers">
                    <div><span>NOTA GERAL</span><strong>{selected.score.toFixed(2).replace('.', ',')}</strong><small>Top 18%</small></div>
                    <div><span>POTENCIAL</span><strong>{selected.potential}</strong><small>Acima da média</small></div>
                    <div><span>IDADE</span><strong>{selected.age}</strong><small>{selected.height} cm</small></div>
                  </div>
                  <div className="insight-card">
                    <div><strong>Nota de observação</strong><p>Boa leitura de jogo e segurança nas defesas. Acompanhar evolução nas saídas aéreas.</p></div>
                  </div>
                </>
              )}

              {tab === 'Métricas' && (
                <div className="metrics-list">
                  {radarLabels.map((label, index) => (
                    <div className="metric-row" key={label}><span>{label}</span><i><b style={{ width: `${selected.metrics[index]}%` }} /></i><strong>{selected.metrics[index]}</strong></div>
                  ))}
                </div>
              )}

              {tab === 'Histórico' && (
                <div className="history-list">
                  <div><span className="history-dot" /><p><strong>Perfil revisado</strong><span>Hoje, 10:42 · por você</span></p></div>
                  <div><span className="history-dot" /><p><strong>Planilha FM 2026 importada</strong><span>12 Jun, 15:28</span></p></div>
                  <div><span className="history-dot muted" /><p><strong>Jogador adicionado</strong><span>04 Jun, 09:10</span></p></div>
                </div>
              )}

              <button className="full-profile" onClick={() => setActivePage('player')}>Abrir perfil completo {icons.chevron}</button>
            </aside>
          </div>
          </>
          ) : activePage === 'profiles' ? (
            <PlayersSetupPage />
          ) : activePage === 'player' ? (
            <PlayerFullProfile player={selected} onBack={() => setActivePage('players')} />
          ) : (
            <PlayersDirectoryPage
              shortlistOnly={activePage === 'shortlist'}
              onOpenPlayer={(playerId) => {
                setSelectedId(playerId)
                setActivePage('player')
              }}
            />
          )}
        </div>
      </main>
      {mobileNav && <button aria-label="Fechar menu" className="backdrop" onClick={() => setMobileNav(false)} />}
      {showImport && <ImportModal onClose={() => setShowImport(false)} />}
    </div>
  )
}
