import { TYPE_LABELS, getHudForPokemon, type PokemonData } from '../types';
import { useRef } from 'react';

interface LeftShellProps {
  data: PokemonData | null;
  id: number;
  shiny: boolean;
  prevName: string;
  nextName: string;
  onPrev: () => void;
  onNext: () => void;
  onShinyToggle: () => void;
  onSearch: (query: string) => void;
  children: React.ReactNode;
}

export default function LeftShell({
  data,
  id,
  shiny,
  prevName,
  nextName,
  onPrev,
  onNext,
  onShinyToggle,
  onSearch,
  children,
}: LeftShellProps) {
  const hud = getHudForPokemon(id);

  const dispatchToCanvas = (key: string) => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    }
  };

  const handleDpadUp = () => dispatchToCanvas('+');
  const handleDpadDown = () => dispatchToCanvas('-');

  const searchRef = useRef<HTMLInputElement>(null);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchRef.current?.value?.trim();
    if (q) {
      onSearch(q);
      if (searchRef.current) searchRef.current.value = '';
    }
  };

  return (
    <div className="left-shell">
      {/* Gray shell: wraps sensors + screen + display-ready */}
      <div className="gray-shell-wrapper">
        <div className="gray-shell">
        <div className="sensor-dots">
          <div className="sensor-dot" />
          <div className="sensor-dot" />
        </div>

        <div className="screen-recess">
          <div className="screen-inner">
            {/* Name Row */}
            <div className="name-row">
              <div className="name-row-left">
                <span className="id-badge">#{String(id).padStart(3, '0')}</span>
                <span className="pokemon-name">{data?.name ?? '...'}</span>
                <div className="type-chips-inline">
                  {data?.types.map((t) => {
                    const info = TYPE_LABELS[t.type.name];
                    return (
                      <span
                        key={t.type.name}
                        className="type-chip"
                        style={{ borderColor: `${info?.color ?? '#888'}60`, background: `${info?.color ?? '#888'}12`, color: info?.color }}
                      >
                        <img
                          src={`/type-icons/${t.type.name}.svg`}
                          alt={t.type.name}
                          className="type-icon"
                        />
                        {info?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="name-row-right">
                <button
                  className={`icon-btn ${shiny ? 'active' : ''}`}
                  onClick={onShinyToggle}
                >
                  <span className="material-symbols-rounded">star</span>
                  SHINY
                </button>
                <button
                  className="icon-btn"
                  onClick={() => {
                    if (data?.cries?.latest) {
                      const audio = new Audio(data.cries.latest);
                      audio.play();
                    }
                  }}
                >
                  <span className="material-symbols-rounded">volume_up</span>
                  CRY
                </button>
              </div>
            </div>

            {/* Viewer */}
            <div className="viewer-area">
              <div className="viewer-glow" />
              <div className="hologram-platform" />
              <div className="ring-deco">
                <div className="ring ring-1" />
                <div className="ring ring-2" />
                <span className="degree-mark top">000°</span>
                <span className="degree-mark right">090°</span>
                <span className="degree-mark bottom">180°</span>
                <span className="degree-mark left">270°</span>
              </div>
              {children}
            </div>

            {/* Nav Strip */}
            <div className="nav-strip">
              <button className="nav-arrow" onClick={onPrev} disabled={id <= 1}>
                ‹ #{String(Math.max(1, id - 1)).padStart(3, '0')} {prevName}
              </button>
              <div className="nav-fps">120 FPS // CALIBRADO</div>
              <button className="nav-arrow" onClick={onNext} disabled={id >= 1025}>
                #{String(Math.min(1025, id + 1)).padStart(3, '0')} {nextName} ›
              </button>
            </div>

            {/* Search Bar */}
            <div className="search-bar">
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: 6, width: '100%' }}>
                <input
                  className="search-input"
                  placeholder="Buscar por nome ou #..."
                  ref={searchRef}
                />
                <button type="submit" className="search-btn">
                  <span className="material-symbols-rounded" style={{ fontSize: 16 }}>search</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Below screen */}
        <div className="below-screen">
          <div className="display-ready">
            <div className="led-small" />
            <span className="display-ready-text">DISPLAY READY</span>
          </div>
          <div className="speaker-grill">
            <div className="speaker-line" />
            <div className="speaker-line" />
            <div className="speaker-line" />
            <div className="speaker-line" />
            <div className="speaker-line" />
          </div>
        </div>
      </div>
      </div>

      {/* Control Panel (separate red block) */}
      <div className="control-panel">
        <button className="analog-btn" title="Controle analógico" />
        <div className="pill-group">
          <div className="pill pill-red" />
          <div className="pill pill-blue" />
        </div>
        <div className="dpad">
          <button className="dpad-btn dpad-up" onClick={handleDpadUp}>▲</button>
          <button className="dpad-btn dpad-down" onClick={handleDpadDown}>▼</button>
          <button className="dpad-btn dpad-left" onClick={onPrev}>◀</button>
          <button className="dpad-btn dpad-right" onClick={onNext}>▶</button>
          <div className="dpad-center" />
        </div>
      </div>
    </div>
  );
}
