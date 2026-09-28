import { useEffect, useState, useCallback, useRef } from 'react';
import gsap from 'gsap';
import LeftShell from './components/LeftShell';
import RightTerminal from './components/RightTerminal';
import Hinge from './components/Hinge';
import PokemonViewer from './components/PokemonViewer';
import {
  type PokemonData,
  type PokemonSpecies,
  type EvolutionChain,
  type EvoStage,
  flattenEvoChain,
} from './types';
import './App.css';

export default function App() {
  const [id, setId] = useState(1);
  const [data, setData] = useState<PokemonData | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [evoStages, setEvoStages] = useState<EvoStage[]>([]);
  const [shiny, setShiny] = useState(false);
  const [booted, setBooted] = useState(false);
  const [prevName, setPrevName] = useState('');
  const [nextName, setNextName] = useState('');
  const bootRef = useRef<HTMLDivElement>(null);

  // Boot animation
  useEffect(() => {
    if (!bootRef.current) return;
    const tl = gsap.timeline({ onComplete: () => setBooted(true) });
    tl.to('.boot-overlay', { opacity: 1, duration: 0 })
      .to('.lens-boot', { opacity: 1, scale: 1.2, duration: 0.3, ease: 'power2.out' })
      .to('.lens-boot', { opacity: 0.3, duration: 0.15 })
      .to('.lens-boot', { opacity: 1, scale: 1, duration: 0.2 })
      .to('.boot-overlay', { opacity: 0, duration: 0.4, ease: 'power2.in' }, '+=0.2');
    return () => { tl.kill(); setBooted(true); };
  }, []);

  // Fetch all data
  useEffect(() => {
    const controller = new AbortController();
    setData(null);
    setSpecies(null);
    setEvoStages([]);
    setPrevName('');
    setNextName('');

    // Fetch main pokemon
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, { signal: controller.signal })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d: PokemonData) => {
        setData(d);
        // Fetch species
        return fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`, { signal: controller.signal })
          .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
          .then((s: PokemonSpecies) => {
            setSpecies(s);
            // Fetch evolution chain
            if (s.evolution_chain?.url) {
              return fetch(s.evolution_chain.url, { signal: controller.signal })
                .then((r) => r?.json?.())
                .then((e: EvolutionChain | undefined) => {
                  if (e) {
                    setEvoStages(flattenEvoChain(e.chain, d.name));
                  }
                });
            }
          });
      })
      .catch(() => {});

    // Fetch prev/next names
    if (id > 1) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${id - 1}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((d: PokemonData) => setPrevName(d.name))
        .catch(() => {});
    }
    if (id < 1025) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${id + 1}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((d: PokemonData) => setNextName(d.name))
        .catch(() => {});
    }

    return () => controller.abort();
  }, [id]);

  const handlePrev = useCallback(() => setId((n) => Math.max(1, n - 1)), []);
  const handleNext = useCallback(() => setId((n) => Math.min(1025, n + 1)), []);
  const handleShinyToggle = useCallback(() => setShiny((s) => !s), []);

  const handleInspectEvo = (name: string) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((r) => r.json())
      .then((d: PokemonData) => setId(d.id))
      .catch(() => {});
  };

  const handleSearch = (query: string) => {
    // Try exact number
    const num = Number(query);
    if (!isNaN(num) && num >= 1 && num <= 1025) {
      setId(num);
      return;
    }
    // Try exact name
    fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d: PokemonData) => setId(d.id))
      .catch(() => {
        // Fuzzy match with Levenshtein distance
        fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
          .then((r) => r.json())
          .then((list: { results: { name: string; url: string }[] }) => {
            const target = query.toLowerCase();
            let bestMatch = '';
            let bestScore = Infinity;

            for (const p of list.results) {
              const name = p.name;
              // Levenshtein distance
              const dist = levenshtein(target, name);
              // Shorter distance = better match
              if (dist < bestScore) {
                bestScore = dist;
                bestMatch = name;
              }
            }

            // Only match if distance is reasonable (less than half the name length)
            if (bestMatch && bestScore <= Math.max(bestMatch.length, target.length) * 0.5) {
              fetch(`https://pokeapi.co/api/v2/pokemon/${bestMatch}`)
                .then((r) => r.json())
                .then((d: PokemonData) => setId(d.id))
                .catch(() => {});
            }
          });
      });
  };

  // Levenshtein distance for fuzzy search
  function levenshtein(a: string, b: string): number {
    const m = a.length;
    const n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[m][n];
  }

  return (
    <div className="device-wrapper">
      {!booted && (
        <div className="boot-overlay" ref={bootRef}>
          <div className="lens-boot" />
        </div>
      )}

      <div className="device">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="top-bar-left">
            <div className="lens" />
            <div className="led-pill">
              <div className="led-dot-group">
                <div className="led led-red" />
                <span className="led-label red">PWR</span>
              </div>
              <div className="led-dot-group">
                <div className="led led-yellow" />
                <span className="led-label yellow">DATA</span>
              </div>
              <div className="led-dot-group">
                <div className="led led-green" />
                <span className="led-label green">LINK</span>
              </div>
            </div>
            <div className="top-title-group">
              <div className="top-title-row">
                <span className="top-title">POKÉDEX OS</span>
                <span className="top-badge">KANTO V1.51</span>
              </div>
              <span className="top-subtitle">SILPH CORP. // BIOMETRIC TACTICAL UNIT</span>
            </div>
          </div>
          <div className="top-bar-right">
            <div className="top-registration">
              <div className="top-registration-dot" />
              <span className="top-registration-text">REGISTRO ATIVO: #{String(id).padStart(3, '0')}</span>
            </div>
            <div className="top-vent">
              <div className="top-vent-line" />
              <div className="top-vent-line" />
              <div className="top-vent-line" />
              <div className="top-vent-line" />
              <div className="top-vent-line" />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="device-body">
          <LeftShell
            data={data}
            id={id}
            shiny={shiny}
            prevName={prevName}
            nextName={nextName}
            onPrev={handlePrev}
            onNext={handleNext}
            onShinyToggle={handleShinyToggle}
            onSearch={handleSearch}
          >
            <PokemonViewer id={id} shiny={shiny} />
          </LeftShell>

          <Hinge />

          <RightTerminal
            data={data}
            species={species}
            evoStages={evoStages}
            onInspectEvo={handleInspectEvo}
          />
        </div>
      </div>
    </div>
  );
}
