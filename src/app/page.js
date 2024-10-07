"use client";
import { Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import Moodeng from "../../public/Moodeng"; // Default import
import "./globals.css";
import Head from "next/head";
import { PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";

function RotatingMoodeng() {
  const moodengRef = useRef(); // Reference for the model

  // Rotate the model on each frame
  useFrame(() => {
    if (moodengRef.current) {
      moodengRef.current.rotation.y += 0.01;
    }
  });

  return <Moodeng ref={moodengRef} />;
}

export default function Home() {
  const [counter, setCounter] = useState(10);

  useEffect(() => {
    setTimeout(() => {
        window.location.href = "/auth/login"
    }, 3500);
  }, []);

  return (
    <div
      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
      style={{ textAlign: "center", height: "100vh", overflow: "hidden" }}
    >
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Sans+Thai&family=Noto+Sans+Thai:wght@300;500&family=Roboto&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Canvas style={{ width: "100%", height: "100vh" }}>
        <PerspectiveCamera makeDefault position={[10, 7, 15]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls />
        <Suspense fallback={null}>
          <RotatingMoodeng /> {/* Use the updated component with rotation */}
        </Suspense>
        <Environment preset="sunset" />
      </Canvas>
      <h1
        className="text-7xl drop-shadow-2xl font-semibold text-white"
        style={{ marginTop: "0px", position: "relative", top: "-350px" }}
      >
        Marksenger
      </h1>
    </div>
  );
}
