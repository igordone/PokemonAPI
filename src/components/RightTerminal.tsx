import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  STAT_HUD,
  STAT_MAX,
  getPrimaryTypeColor,
  type PokemonData,
  type PokemonSpecies,
  type EvoStage,
} from '../types';

interface RightTerminalProps {
  data: PokemonData | null;
  species: PokemonSpecies | null;
  evoStages: EvoStage[];
  onInspectEvo: (name: string) => void;
}

const BAR_GRADIENTS: Record<string, string> = {
  hp: 'linear-gradient(90deg, #15803d, #4ade80)',
  attack: 'linear-gradient(90deg, #b45309, #facc15)',
  defense: 'linear-gradient(90deg, #c2410c, #fb923c)',
  'special-attack': 'linear-gradient(90deg, #7c3aed, #c084fc)',
  'special-defense': 'linear-gradient(90deg, #6d28d9, #a78bfa)',
  speed: 'linear-gradient(90deg, #0e7490, #22d3ee)',
};

const Icon = ({ name, size = 18 }: { name: string; size?: number }) => (
  <span className="material-symbols-rounded" style={{ fontSize: size }}>{name}</span>
);

export default function RightTerminal({
  data,
  species,
  evoStages,
  onInspectEvo,
}: RightTerminalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const timer = setTimeout(() => {
      const items = contentRef.current!.querySelectorAll('.anim');
      if (items.length) {
        gsap.fromTo(items,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.04, duration: 0.35, ease: 'power2.out' }
        );
      }
      const bars = contentRef.current!.querySelectorAll<HTMLElement>('.stat-bar-fill');
      bars.forEach((bar) => {
        const pct = bar.dataset.pct;
        if (pct) gsap.fromTo(bar, { width: '0%' }, { width: `${pct}%`, duration: 0.7, ease: 'power2.out', delay: 0.2 });
      });
    }, 30);
    return () => clearTimeout(timer);
  }, [data]);

  if (!data) return (
    <div className="right-shell">
      <div className="terminal">
        <div className="terminal-header">
          <span className="terminal-title">TERMINAL SECUNDÁRIO // KANTO</span>
          <div className="terminal-dot" />
        </div>
      </div>
    </div>
  );

  const typeColor = getPrimaryTypeColor(data.types);
  const captureRate = species?.capture_rate ?? 0;
  const genderRate = species?.gender_rate ?? -1;
  const heightM = (data.height / 10).toFixed(1);
  const weightKg = (data.weight / 10).toFixed(1);
  const bst = data.stats.reduce((sum, s) => sum + s.base_stat, 0);
  const flavorEntry = species?.flavor_text_entries?.find((e) => e.language.name === 'pt') ?? species?.flavor_text_entries?.find((e) => e.language.name === 'en');
  const flavorText = flavorEntry?.flavor_text.replace(/[\n\f]/g, ' ').replace(/\s+/g, ' ') ?? '';
  const primaryAbility = data.abilities.find((a) => !a.is_hidden);
  const hiddenAbility = data.abilities.find((a) => a.is_hidden);

  const genderDisplay =
    genderRate === -1 ? 'SEXLESS' :
    genderRate === 0 ? '100% ♂' :
    genderRate === 8 ? '100% ♀' :
    `${Math.round((1 - genderRate / 8) * 100)}% ♂ / ${Math.round((genderRate / 8) * 100)}% ♀`;
  const captureColor = captureRate >= 200 ? 'var(--green)' : captureRate >= 100 ? 'var(--text-muted)' : 'var(--alert)';

  return (
    <div className="right-shell">
      <div className="terminal">
        {/* Header */}
        <div className="terminal-header">
          <span className="terminal-title">TERMINAL SECUNDÁRIO // KANTO</span>
          <div className="terminal-dot" />
        </div>

        {/* Scrollable Content — all sections */}
        <div className="tab-content" ref={contentRef}>

          {/* Metrics */}
          <div className="metrics-grid">
            <div className="card anim">
              <span className="metric-label">ALTURA</span>
              <span className="metric-value">{heightM} m</span>
            </div>
            <div className="card anim">
              <span className="metric-label">PESO</span>
              <span className="metric-value">{weightKg} kg</span>
            </div>
            <div className="card anim">
              <span className="metric-label">GÊNERO</span>
              <span className="metric-value" style={{ fontSize: 13 }}>{genderDisplay}</span>
            </div>
            <div className="card anim">
              <span className="metric-label">CAPTURA</span>
              <span className="metric-value" style={{ color: captureColor }}>{captureRate}</span>
            </div>
          </div>

          {/* Habitat */}
          <div className="metrics-grid anim" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="card">
              <span className="metric-label">HABITAT</span>
              <span className="metric-value" style={{ fontSize: 14, textTransform: 'uppercase' }}>{species?.habitat?.name ?? 'DESCONHECIDO'}</span>
            </div>
            <div className="card">
              <span className="metric-label">COR</span>
              <span className="metric-value" style={{ fontSize: 14, textTransform: 'uppercase', color: typeColor }}>{species?.color?.name ?? '—'}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="card anim">
            <div className="card-header">
              <span className="card-title">
                <Icon name="monitoring" />
                STATUS BASE DE COMBATE
              </span>
              <span className="card-badge cyan">BST: {bst}</span>
            </div>
            {data.stats.map((s) => {
              const info = STAT_HUD[s.stat.name];
              const max = STAT_MAX[s.stat.name] ?? 255;
              const pct = Math.min((s.base_stat / max) * 100, 100);
              return (
                <div key={s.stat.name} className="stat-bar-row">
                  <span className="stat-bar-label" style={{ color: info?.color }}>{info?.label ?? s.stat.name}</span>
                  <div className="stat-bar-track">
                        <div className="stat-bar-fill" data-pct={pct} style={{ background: BAR_GRADIENTS[s.stat.name] ?? `linear-gradient(90deg, ${typeColor}, ${typeColor}cc)` }} />
                  </div>
                  <span className="stat-bar-value">{s.base_stat}</span>
                  <span className="stat-bar-max">/ 255</span>
                </div>
              );
            })}
          </div>

          {/* Flavor Text */}
          {flavorText && (
            <div className="card anim">
              <div className="card-header">
                <span className="card-title" style={{ color: '#991b1b' }}>
                  <Icon name="warning" />
                  OBSERVAÇÃO DE COMBATE
                </span>
                <span className="card-badge red">ALERTA</span>
              </div>
              <p className="lore-text">{flavorText}</p>
            </div>
          )}

          {/* Abilities */}
          <div className="abilities-grid anim">
            {primaryAbility && (
              <div className="card">
                <div className="ability-card-header">
                  <span className="ability-name">{primaryAbility.ability.name.replace('-', ' ')}</span>
                  <span className="card-badge green">PRIMÁRIA</span>
                </div>
                <div className="ability-desc">Habilidade principal registrada no sistema.</div>
              </div>
            )}
            {hiddenAbility && (
              <div className="card">
                <div className="ability-card-header">
                  <span className="ability-name">{hiddenAbility.ability.name.replace('-', ' ')}</span>
                  <span className="card-badge red">OCULTA</span>
                </div>
                <div className="ability-desc">Habilidade secreta — ativa em condições específicas.</div>
              </div>
            )}
          </div>

          {/* Evolution */}
          <div className="card anim">
            <div className="card-header">
              <span className="card-title">
                <Icon name="alt_route" />
                CADEIA EVOLUTIVA
              </span>
              <span className="card-badge green">{evoStages.length} ESTÁGIO{evoStages.length > 1 ? 'S' : ''}</span>
            </div>
            <div className="evo-chain">
              {evoStages.map((stage, i) => (
                <div key={stage.name} style={{ display: 'flex', alignItems: 'center' }}>
                  {i > 0 && <span className="evo-arrow">→</span>}
                  <div
                    className={`evo-stage ${stage.isCurrent ? 'current' : ''}`}
                    onClick={() => !stage.isCurrent && onInspectEvo(stage.name)}
                  >
                    <img className="evo-sprite" src={stage.sprite} alt={stage.name} />
                    <span className="evo-name">{stage.name}</span>
                    <span className="evo-id">#{String(stage.id).padStart(3, '0')}</span>
                    {stage.requirement && <span className="evo-req">{stage.requirement}</span>}
                    {stage.isCurrent && <span className="card-badge green" style={{ marginTop: 2 }}>ATUAL</span>}
                  </div>
                </div>
              ))}
            </div>
            {evoStages.length <= 1 && (
              <p className="lore-text anim" style={{ textAlign: 'center', marginTop: 10 }}>
                Forma final — sem evolução subsequente registrada.
              </p>
            )}
          </div>
        </div>

        {/* Terminal inner footer */}
        <div className="terminal-footer">
          <span className="footer-text" style={{ color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 4px var(--green)' }} />
            HARDWARE: SILPH INDUSTRIAL CORP.
          </span>
          <span className="footer-text">FREQ: 142.80 MHZ</span>
        </div>
      </div>

      {/* Device Footer */}
      <div className="device-footer">
        <span className="footer-text">© POKÉDEX QUANTUM OS // MODEL 151</span>
        <span className="footer-badge">KANTO CERTIFIED</span>
      </div>
    </div>
  );
}
