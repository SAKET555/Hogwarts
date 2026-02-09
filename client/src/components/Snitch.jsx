import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';

const SnitchCore = () => {
    const wingsRef = useRef();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (wingsRef.current) {
            // Fast wing flapping animation
            wingsRef.current.children[0].rotation.z = Math.sin(t * 20) * 0.8;
            wingsRef.current.children[1].rotation.z = -Math.sin(t * 20) * 0.8;
        }
    });

    return (
        <group>
            {/* Golden Body */}
            <Sphere args={[0.3, 32, 32]}>
                <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} emissive="#665500" />
            </Sphere>

            {/* Wings */}
            <group ref={wingsRef}>
                {/* Left Wing */}
                <mesh position={[-0.3, 0, 0]} rotation={[0, 0, 0.5]}>
                    <planeGeometry args={[1, 0.4]} />
                    <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} side={2} />
                </mesh>
                {/* Right Wing */}
                <mesh position={[0.3, 0, 0]} rotation={[0, 0, -0.5]}>
                    <planeGeometry args={[1, 0.4]} />
                    <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} side={2} />
                </mesh>
            </group>
        </group>
    );
};

const Snitch = () => {
    return (
        <div style={{ width: '100%', height: '300px', cursor: 'grab' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#FFD700" />
                <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <Float speed={5} rotationIntensity={2} floatIntensity={2}>
                    <SnitchCore />
                </Float>
            </Canvas>
        </div>
    );
};

export default Snitch;
