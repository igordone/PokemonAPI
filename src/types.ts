export type PokemonData = {
  name: string;
  id: number;
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  height: number;
  weight: number;
  abilities: {
    ability: { name: string };
    is_hidden: boolean;
  }[];
  sprites: {
    other?: {
      'official-artwork'?: { front_default: string };
      dream_world?: { front_default: string };
    };
    front_default: string;
  };
  cries: {
    latest: string;
    legacy: string;
  };
};

export type PokemonSpecies = {
  capture_rate: number;
  gender_rate: number;
  color: { name: string };
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
  }[];
  evolution_chain: { url: string } | null;
  habitat: { name: string } | null;
  genera: {
    genus: string;
    language: { name: string };
  }[];
};

export type EvolutionNode = {
  species: { name: string; url: string };
  evolves_to: EvolutionNode[];
  evolution_details: {
    min_level: number | null;
    trigger: { name: string };
    item: { name: string } | null;
  }[];
};

export type EvolutionChain = {
  chain: EvolutionNode;
};

export type EvoStage = {
  name: string;
  id: number;
  sprite: string;
  requirement: string;
  isCurrent: boolean;
};

export const TYPE_LABELS: Record<string, { label: string; sub: string; color: string }> = {
  bug:      { label: 'BUG',   sub: 'INSETO',  color: '#bdc367' },
  poison:   { label: 'POISON', sub: 'TÓXICO',  color: '#b763cf' },
  fire:     { label: 'FIRE',  sub: 'PIRO',    color: '#fd7d24' },
  water:    { label: 'WATER', sub: 'HIDRO',   color: '#4592c4' },
  grass:    { label: 'GRASS', sub: 'FLORA',   color: '#5fbd58' },
  electric: { label: 'ELECTRIC', sub: 'VOLTS', color: '#eed535' },
  ice:      { label: 'ICE',   sub: 'CRYO',    color: '#51c4e7' },
  fighting: { label: 'FIGHTING', sub: 'LUTA', color: '#d3425d' },
  ground:   { label: 'GROUND', sub: 'TELLUS', color: '#da7c4d' },
  flying:   { label: 'FLYING', sub: 'AETHER', color: '#a890f0' },
  psychic:  { label: 'PSYCHIC', sub: 'MENTE', color: '#fa6555' },
  rock:     { label: 'ROCK',  sub: 'LITHO',   color: '#a38c21' },
  ghost:    { label: 'GHOST', sub: 'SPECTRA', color: '#7b62a3' },
  dragon:   { label: 'DRAGON', sub: 'DRAKO',  color: '#6f35fc' },
  dark:     { label: 'DARK',  sub: 'UMBRA',   color: '#705746' },
  steel:    { label: 'STEEL', sub: 'FERRO',   color: '#b8b8d0' },
  fairy:    { label: 'FAIRY', sub: 'LUMIA',   color: '#f4bdc9' },
  normal:   { label: 'NORMAL', sub: 'GENUS',  color: '#a4acaf' },
};

export const STAT_HUD: Record<string, { label: string; sub: string; color: string }> = {
  hp:               { label: 'HP',              sub: 'PONTOS DE VIDA',     color: 'var(--green)' },
  attack:           { label: 'ATAQUE',          sub: 'ATAQUE FÍSICO',      color: 'var(--amber)' },
  defense:          { label: 'DEFESA',          sub: 'DEFESA CARAPAÇA',    color: 'var(--amber)' },
  'special-attack': { label: 'SP. ATK',        sub: 'SP. ATAQUE (TOXINA)', color: 'var(--violet)' },
  'special-defense':{ label: 'SP. DEF',        sub: 'SP. DEFESA',         color: 'var(--violet)' },
  speed:            { label: 'AGILIDADE',       sub: 'VELOCIDADE',         color: 'var(--cyan)' },
};

export const STAT_MAX: Record<string, number> = {
  hp: 255, attack: 190, defense: 250,
  'special-attack': 194, 'special-defense': 250, speed: 200,
};

export function getPrimaryTypeColor(types: { type: { name: string } }[]): string {
  const first = types?.[0]?.type?.name;
  return TYPE_LABELS[first]?.color ?? 'var(--green)';
}

export const MOCK_HUD: Record<number, {
  specimen: string;
  habitat: string;
  coords: string;
  humidity: string;
  annotation: string;
}> = {
  1:  { specimen: 'SEMENTE BIO-L1 // PLANTA PRIMORDIAL',   habitat: 'TERRAVERDE // SUB-01A', coords: '35.676°N', humidity: '72.1%', annotation: 'BULBASSAUR [SCM]' },
  2:  { specimen: 'BROTAMENTO BIO-L2 // ESTÁGIO VEGETAL',  habitat: 'TERRAVERDE // SUB-01B', coords: '35.676°N', humidity: '75.3%', annotation: 'IVYSAUR [SCM]' },
  3:  { specimen: 'FLORADA BIO-L3 // PLANTA GIGANTE',      habitat: 'TERRAVERDE // SUB-01C', coords: '35.676°N', humidity: '80.0%', annotation: 'VENUSAUR [SCM]' },
  4:  { specimen: 'EMBER BIO-L1 // LAGARTO IGNIS',         habitat: 'MT. CHIMNEY // SUB-03A', coords: '34.982°N', humidity: '31.2%', annotation: 'CHARMANDER [SCM]' },
  5:  { specimen: 'FLAME BIO-L2 // DRACO IGNIS',           habitat: 'MT. CHIMNEY // SUB-03B', coords: '34.982°N', humidity: '28.5%', annotation: 'CHARMELEON [SCM]' },
  6:  { specimen: 'PIRO BIO-L3 // DRACO SUPREMO',          habitat: 'MT. CHIMNEY // SUB-03C', coords: '34.982°N', humidity: '22.0%', annotation: 'CHARIZARD [SCM]' },
  7:  { specimen: 'AQUA BIO-L1 // REPTIL AQUÁTICO',        habitat: 'CERULEAN CAVE // SUB-04A', coords: '36.012°N', humidity: '94.5%', annotation: 'SQUIRTLE [SCM]' },
  8:  { specimen: 'AQUA BIO-L2 // TORTUGA AQUÁTICA',       habitat: 'CERULEAN CAVE // SUB-04B', coords: '36.012°N', humidity: '95.0%', annotation: 'WARTORTLE [SCM]' },
  9:  { specimen: 'HYDRO BIO-L3 // TARTARUGA COLOSSAL',    habitat: 'CERULEAN CAVE // SUB-04C', coords: '36.012°N', humidity: '96.2%', annotation: 'BLASTOISE [SCM]' },
  10: { specimen: 'VERME BIO-L1 // LARVA TENAZ',           habitat: 'VIRIDIAN CANOPY // SUB-02A', coords: '35.124°N', humidity: '86.7%', annotation: 'CATERPIE [SCM]' },
  11: { specimen: 'CASULO BIO-L2 // CRISÁLIDA RÍGIDA',     habitat: 'VIRIDIAN CANOPY // SUB-02B', coords: '35.124°N', humidity: '88.4%', annotation: 'METAPOD [SCM]' },
  12: { specimen: 'ALADO BIO-L3 // BORBOLETEÓIDE',         habitat: 'VIRIDIAN CANOPY // SUB-02C', coords: '35.124°N', humidity: '84.0%', annotation: 'BUTTERFREE [SCM]' },
  13: { specimen: 'ÁCARO BIO-L1 // VESPA VENENOSA',        habitat: 'VIRIDIAN CANOPY // SUB-02A', coords: '35.124°N', humidity: '87.2%', annotation: 'WEEDLE [SCM]' },
  14: { specimen: 'CRISÁLIDA BIO-L2 // CASULO TOXICÓIDE',  habitat: 'VIRIDIAN CANOPY // SUB-02B', coords: '35.124°N', humidity: '88.4%', annotation: 'KAKUNA [SCM]' },
  15: { specimen: 'AGULHÃO BIO-L3 // VESPA SUPREMA',       habitat: 'VIRIDIAN CANOPY // SUB-02C', coords: '35.124°N', humidity: '83.5%', annotation: 'BEEDRILL [SCM]' },
  25: { specimen: 'ELETRON BIO-L1 // ROEDOR VOLTAICO',     habitat: 'VERMILION PORT // SUB-05A', coords: '35.450°N', humidity: '60.0%', annotation: 'PIKACHU [SCM]' },
  26: { specimen: 'RAIODE BIO-L2 // ROEDOR THUNDERUS',     habitat: 'VERMILION PORT // SUB-05B', coords: '35.450°N', humidity: '58.0%', annotation: 'RAICHU [SCM]' },
  133:{ specimen: 'VERSÁTIL BIO-L1 // MUTÁGEL ELÁSTICO',   habitat: 'CELADON DEPT // SUB-07A', coords: '35.210°N', humidity: '55.0%', annotation: 'EEVEE [SCM]' },
  150:{ specimen: 'GENESIS BIO-LEG // PSIQUIS SUPREMO',    habitat: 'CERULEAN CAVE // SUB-99A', coords: '36.050°N', humidity: '99.0%', annotation: 'MEWTWO [SCM]' },
};

export function getHudForPokemon(id: number) {
  if (MOCK_HUD[id]) return MOCK_HUD[id];
  return {
    specimen: `ESPÉCIME BIO-L${Math.ceil(id / 50)} // REGISTRO GENÉRICO`,
    habitat: `REGIÃO DESCONHECIDA // SUB-${String(id).padStart(2, '0')}A`,
    coords: `${(35 + (id * 0.003) % 5).toFixed(3)}°N`,
    humidity: `${(50 + (id * 1.7) % 49).toFixed(1)}%`,
    annotation: `#${String(id).padStart(3, '0')} [SCM]`,
  };
}

export const TYPE_SPECIMEN: Record<string, string> = {
  bug: 'LARVA INSETO',
  poison: 'TOXICÓIDE',
  fire: 'LAGARTO IGNIS',
  water: 'REPTIL AQUÁTICO',
  grass: 'PLANTA PRIMORDIAL',
  electric: 'ROEDOR VOLTAICO',
  ice: 'CRYÓIDE',
  fighting: 'MARTIALÓIDE',
  ground: 'TELLUROIDE',
  flying: 'AETHERÓIDE',
  psychic: 'PSIQUÓIDE',
  rock: 'LITHÓIDE',
  ghost: 'SPECTRÓIDE',
  dragon: 'DRACONÓIDE',
  dark: 'UMBROIDE',
  steel: 'FERROÓIDE',
  fairy: 'LUMIÓIDE',
  normal: 'GENUS COMUM',
};

export function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? parseInt(match[1], 10) : 0;
}

export function formatRequirement(detail: NonNullable<EvolutionNode['evolution_details']>[0]): string {
  if (detail.min_level) return `LVL ${detail.min_level}`;
  if (detail.trigger?.name === 'trade') return 'TRADE';
  if (detail.item) return detail.item.name.replace('-', ' ').toUpperCase();
  if (detail.trigger?.name === 'shed') return 'shed';
  return '';
}

export function flattenEvoChain(
  node: EvolutionNode,
  currentName: string,
  acc: EvoStage[] = []
): EvoStage[] {
  const id = extractIdFromUrl(node.species.url);
  const req = node.evolution_details[0] ? formatRequirement(node.evolution_details[0]) : '';
  acc.push({
    name: node.species.name,
    id,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    requirement: req,
    isCurrent: node.species.name === currentName,
  });
  for (const child of node.evolves_to) {
    flattenEvoChain(child, currentName, acc);
  }
  return acc;
}
