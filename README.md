# Pokedex 3D

Uma Pokedex interativa e imersiva com visual 3D, construída como um **remake** de um projeto anterior, agora refatorada com tecnologias modernas para uma experiência muito mais fluida e visual.

## Sobre o Projeto

Este projeto é a evolução de uma Pokedex clássica que utilizava apenas sprites 2D. Agora, com a integração de modelos 3D e animações suaves, a interface se transforma em um dispositivo estilo handheld dos games Pokémon, completo com efeitos de boot, LEDs indicadores, navegação por D-Pad e um terminal lateral com dados detalhados.

## Principais Funcionalidades

- **Visualização 3D interativa** dos Pokémon com controle de órbita (rotacionar, zoom)
- **Mais de 1025 Pokémon** disponíveis via PokeAPI
- **Modo Shiny** com toggle para visualizar versões raras
- **Animações de entrada** suaves via GSAP (escala + rotação ao trocar de Pokémon)
- **Efeito de boot** estilo dispositivo real
- **Terminal lateral** com stats de combate, habilidades, cadeia evolutiva e dados da espécie
- **Busca fuzzy** por nome ou número (com distância de Levenshtein)
- **Cry do Pokémon** reproduzido ao clicar no botão de áudio
- **Navegação completa**: botões, D-Pad e barra de busca

## Stack Utilizada

| Tecnologia | Uso |
|---|---|
| React 19 | Framework UI |
| TypeScript | Tipagem estática |
| Vite | Build tool e dev server |
| Three.js | Renderização 3D |
| React Three Fiber | Wrapper React para Three.js |
| React Three Drei | Utilitários para R3F (OrbitControls, Environment, Bounds, Center) |
| GSAP | Animações de entrada, transições e efeitos visuais |

## Repositórios e APIs Utilizados

- **[PokeAPI](https://pokeapi.co/)** — API REST para dados de todos os Pokémon (stats, tipos, evoluções, species, cries)
- **[Pokemon 3D API - Assets](https://github.com/Pokemon-3D-api/assets)** — Modelos 3D em formato GLB dos Pokémon (regular e shiny)
- **[Google Material Symbols](https://fonts.google.com/icons)** — Ícones de interface utilizados no terminal e controles

## Como Rodar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## Estrutura do Projeto

```
src/
├── App.tsx              # Componente principal, lógica de dados e navegação
├── App.css              # Estilos globais do dispositivo
├── main.tsx             # Entry point
├── types.ts             # Types, constantes e utilitários
├── components/
│   ├── LeftShell.tsx    # Lado esquerdo: tela 3D, navegação, busca, controles
│   ├── RightTerminal.tsx # Lado direito: terminal com stats, evolução, lore
│   ├── PokemonViewer.tsx # Canvas 3D com modelo do Pokémon
│   └── Hinge.tsx        # Elemento de bisagra entre os dois lados
└── public/
    ├── type-icons/      # Ícones SVG dos tipos dos Pokémon
    └── ...
```

---

*Feito com carinho para fãs de Pokémon que sempre quiseram segurar uma Pokédex de verdade.*
