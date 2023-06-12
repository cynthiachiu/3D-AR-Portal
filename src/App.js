import { Suspense, useState } from "react";
import * as THREE from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  Mask,
  useMask,
  Float,
  OrbitControls,
  MeshDistortMaterial,
} from "@react-three/drei";
import { ARButton, XR, Interactive } from "@react-three/xr";

function MaskedContent({ invert, ...props }) {
  /* The useMask hook has to refer to the mask id defined below, the content
   * will then be stamped out.
   */
  const stencil = useMask(1, invert);

  const texture = useLoader(
    THREE.TextureLoader,
    "cyberpunk_a_dark_city_during_the_night_with_neon_l.jpg"
  );
  return (
    <mesh>
      <sphereBufferGeometry attach="geometry" args={[500, 60, 40]} />
      <meshBasicMaterial
        attach="material"
        map={texture}
        side={THREE.BackSide}
        {...stencil}
      />
    </mesh>
  );
}

export function App() {
  const [invert, setInvert] = useState(false);
  const [colorWrite, setColorWrite] = useState(true);
  const depthWrite = false;

  const onSelect = () => {
    setInvert(!invert);
    setColorWrite(!colorWrite);
  };

  return (
    <>
      <ARButton />
      <Canvas camera={{ position: [0, 0, 5] }}>
        <XR>
          <hemisphereLight intensity={1} groundColor="red" />
          <Suspense fallback={null}>
            <Interactive onSelect={onSelect}>
              <Float
                floatIntensity={3}
                rotationIntensity={1}
                speed={5}
                position={[0, 1, -2]}
              >
                <Mask id={1} colorWrite={colorWrite} depthWrite={depthWrite}>
                  {(spread) => (
                    <>
                      <planeGeometry args={[1, 1, 128, 128]} />
                      <MeshDistortMaterial
                        distort={0.5}
                        radius={1}
                        speed={10}
                        {...spread}
                      />
                    </>
                  )}
                </Mask>
              </Float>
            </Interactive>

            <MaskedContent invert={invert} />
            <OrbitControls makeDefault />
          </Suspense>
        </XR>
      </Canvas>
    </>
  );
}
