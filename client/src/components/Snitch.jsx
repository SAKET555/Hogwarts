import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

/* =======================
   FEATHER COMPONENT
======================= */
const Feather = ({ length, width, side, index }) => {
    const ref = useRef();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (ref.current) {
            // phase-delayed flap = realism
            ref.current.rotation.z =
                Math.sin(t * 18 + index * 0.4) * 0.18;
        }
    });

    return (
        <mesh ref={ref}>
            <planeGeometry args={[length, width, 24, 6]} />
            <meshPhysicalMaterial
                color="#F3D8A0"
                side={THREE.DoubleSide}
                transparent
                opacity={0.95}
                roughness={0.45}
                metalness={0.1}
            />
        </mesh>
    );
};

/* =======================
   WING COMPONENT
======================= */
const Wing = ({ side }) => {
    const wingRef = useRef();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (wingRef.current) {
            // main wing hinge motion
            wingRef.current.rotation.z =
                Math.sin(t * 16) * 0.45 * side;
        }
    });

    const feathers = useMemo(() => {
        return [...Array(12)].map((_, i) => (
            <group
                key={i}
                position={[
                    Math.sin(i * 0.18) * 0.7 * side,
                    -i * 0.03,
                    i * 0.02,
                ]}
                rotation={[0, side * i * 0.05, 0]}
            >
                <Feather
                    length={1.2 - i * 0.05}
                    width={0.18 - i * 0.004}
                    side={side}
                    index={i}
                />
            </group>
        ));
    }, [side]);

    return (
        <group ref={wingRef}>
            {/* Shoulder joint */}
            <mesh>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshPhysicalMaterial
                    color="#C9A227"
                    metalness={0.9}
                    roughness={0.25}
                />
            </mesh>

            {feathers}
        </group>
    );
};

/* =======================
   SNITCH CORE
======================= */
const SnitchCore = () => {
    const group = useRef();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (group.current) {
            group.current.position.y = Math.sin(t * 0.8) * 0.25;
            group.current.rotation.y = t * 0.25;
        }
    });

    return (
        <group ref={group}>
            {/* BODY */}
            <mesh>
                <sphereGeometry args={[0.4, 64, 64]} />
                <meshPhysicalMaterial
                    color="#FFD700"
                    metalness={1}
                    roughness={0.18}
                    envMapIntensity={3}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    sheen={0.5}
                    sheenColor="#FFF1B8"
                />
            </mesh>

            {/* Enchanted glow */}
            <mesh>
                <sphereGeometry args={[0.46, 32, 32]} />
                <meshBasicMaterial
                    color="#FFD700"
                    transparent
                    opacity={0.08}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Wings */}
            <group position={[-0.42, 0.05, 0]}>
                <Wing side={-1} />
            </group>

            <group position={[0.42, 0.05, 0]}>
                <Wing side={1} />
            </group>

            {/* Magical light */}
            <pointLight
                position={[0, 0, 0]}
                intensity={0.6}
                distance={4}
                color="#FFE9A3"
            />
        </group>
    );
};

/* =======================
   MAIN COMPONENT
======================= */
const Snitch = ({ compact = false }) => {
    return (
        <div
            style={{
                width: '100%',
                height: compact ? '180px' : '500px',
                pointerEvents: compact ? 'none' : 'auto',
                borderRadius: '12px',
                margin: compact ? '0 0 20px 0' : '0',
            }}
        >
            <Canvas
                camera={{
                    position: [0, 0, compact ? 5 : 4.5],
                    fov: 45,
                }}
                gl={{
                    antialias: true,
                    alpha: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2,
                }}
            >
                <ambientLight intensity={0.35} />

                <directionalLight
                    position={[5, 5, 5]}
                    intensity={1.4}
                    color="#FFF3C4"
                />

                <directionalLight
                    position={[-4, 2, -3]}
                    intensity={0.6}
                    color="#AFC8FF"
                />

                <Environment preset="sunset" />

                <SnitchCore />

                <OrbitControls
                    enablePan={false}
                    enableZoom={!compact}
                    autoRotate={!compact}
                    autoRotateSpeed={0.6}
                    enableDamping
                    dampingFactor={0.05}
                />
            </Canvas>
        </div>
    );
};

export default Snitch;
