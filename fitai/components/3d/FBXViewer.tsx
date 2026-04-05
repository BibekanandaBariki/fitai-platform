"use client";

import React, { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useFBX, OrbitControls, Environment, Center } from "@react-three/drei";
import * as THREE from "three";

interface FBXModelProps {
    url: string;
    isPlaying: boolean;
    tintColor?: string;
    bmiScale?: number;
}

function FBXModel({ url, isPlaying, tintColor, bmiScale = 1.0 }: FBXModelProps) {
    const fbx = useFBX(url);
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);

    // Apply material colors & create mixer on mount/fbx change
    useEffect(() => {
        if (!fbx) return;

        fbx.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                if (mesh.material) {
                    const applyTint = (mat: THREE.Material) => {
                         if ('emissive' in mat) {
                             const standardMat = mat as THREE.MeshStandardMaterial;
                             if (tintColor) {
                                 standardMat.emissive = new THREE.Color(tintColor);
                                 standardMat.emissiveIntensity = 0.6;
                             } else {
                                 standardMat.emissive = new THREE.Color(0x000000);
                                 standardMat.emissiveIntensity = 0;
                             }
                             standardMat.needsUpdate = true;
                         }
                    };

                    if (Array.isArray(mesh.material)) {
                        mesh.material.forEach(applyTint);
                    } else {
                        applyTint(mesh.material);
                    }
                }
            }
        });

        // Initialize mixing
        if (fbx.animations && fbx.animations.length > 0) {
            mixerRef.current = new THREE.AnimationMixer(fbx);
            const action = mixerRef.current.clipAction(fbx.animations[0]);
            action.setLoop(THREE.LoopRepeat, Infinity);
            action.reset();
            
            if (isPlaying) {
                action.play();
            }
        }

        return () => {
            if (mixerRef.current) {
                mixerRef.current.stopAllAction();
                mixerRef.current = null;
            }
        };
    }, [fbx, url, tintColor, isPlaying]); // re-run if tintColor or isPlaying changes so we apply to meshes

    // Handle Play/Pause toggles seamlessly
    useEffect(() => {
        if (mixerRef.current && fbx && fbx.animations.length > 0) {
            const action = mixerRef.current.clipAction(fbx.animations[0]);
            if (isPlaying) {
                action.paused = false;
                action.play();
            } else {
                action.paused = true;
            }
        }
    }, [isPlaying, fbx]);

    useFrame((state, delta) => {
        if (mixerRef.current && isPlaying) {
            mixerRef.current.update(delta);
        }
    });

    const baseScale = 0.08;
    const xzScale = baseScale * Math.min(Math.max(bmiScale, 0.7), 1.5);
    const yScale = baseScale;

    // Anchor downwards to keep it centered when scaled up
    return (
        <Center position={[0, -0.5, 0]}>
            <primitive object={fbx} scale={[xzScale, yScale, xzScale]} />
        </Center>
    );
}

export function FBXViewer({ url, isPlaying, tintColor, bmiScale }: FBXModelProps) {
    return (
        <div className="w-full h-full min-h-[400px] relative cursor-grab active:cursor-grabbing rounded-3xl overflow-hidden bg-gradient-to-b from-background to-primary/5 border border-primary/10">
            <Canvas shadows camera={{ position: [0, 1.5, 5], fov: 45 }}>
                <React.Suspense fallback={null}>
                    <Environment preset="city" />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
                    
                    <FBXModel url={url} isPlaying={isPlaying} tintColor={tintColor} bmiScale={bmiScale} />
                    
                    <OrbitControls 
                        enablePan={false} 
                        minDistance={2} 
                        maxDistance={8} 
                        maxPolarAngle={Math.PI / 2} 
                        target={[0, 0.5, 0]}
                        autoRotate={isPlaying}
                        autoRotateSpeed={0.5}
                    />
                </React.Suspense>
            </Canvas>
        </div>
    );
}

// Preload the most common model to prevent blank screens
useFBX.preload("/models/male-body.fbx");
