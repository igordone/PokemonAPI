import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Bounds,
  Center,
  Environment,
  OrbitControls,
  useGLTF,
} from '@react-three/drei';
import gsap from 'gsap';
import type { Group } from 'three';

const MODEL_BASE =
  'https://raw.githubusercontent.com/Pokemon-3D-api/assets/main/models/opt/regular';
const MODEL_SHINY =
  'https://raw.githubusercontent.com/Pokemon-3D-api/assets/main/models/opt/shiny';

export const getModelUrl = (id: number, shiny = false) =>
  `${shiny ? MODEL_SHINY : MODEL_BASE}/${id}.glb`;

function Model({ id, shiny }: { id: number; shiny: boolean }) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(getModelUrl(id, shiny));

  useEffect(() => {
    if (!group.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        group.current!.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, duration: 0.7, ease: 'back.out(1.7)' }
      );
      gsap.fromTo(
        group.current!.rotation,
        { y: -Math.PI * 0.4 },
        { y: 0, duration: 0.9, ease: 'power3.out' }
      );
    });
    return () => ctx.revert();
  }, [id, shiny]);

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

interface PokemonViewerProps {
  id: number;
  shiny?: boolean;
}

export default function PokemonViewer({ id, shiny = false }: PokemonViewerProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
      <Canvas camera={{ position: [0, 0.8, 4.5], fov: 40 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={0.9} />
        <directionalLight position={[-3, 4, -2]} intensity={0.2} color="var(--accent)" />
        <Environment preset="city" />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.6}>
            <Center>
              <Model key={`${id}-${shiny ? 's' : 'r'}`} id={id} shiny={shiny} />
            </Center>
          </Bounds>
        </Suspense>
        <OrbitControls
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
          minDistance={2}
          maxDistance={10}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  );
}
