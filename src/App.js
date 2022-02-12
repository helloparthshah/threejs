import * as THREE from "three"
import ReactDOM from "react-dom"
import React, { useRef, useEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import state from "./store"
import {
  Html,
  useScroll,
  Scroll,
  ScrollControls,
  Image
} from '@react-three/drei'
import "./App.css"

function Plane({ color = "white", ...props }) {
  const [hovered, set] = useState(false)
  const [lcolor, setColor] = useState(color)
  useEffect(() => {
    // Split the color into h,s and l
    const hsl = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
    const h = parseInt(hsl[1])
    const s = parseInt(hsl[2])
    const l = parseInt(hsl[3])
    setColor(`hsl(${h}, ${s}%, ${Math.floor(l * (hovered ? 1.05 : 1))}%)`)
  }, [color, hovered])
  return (
    <mesh {...props} onPointerOver={(e) => {
      document.body.style.cursor = "pointer";
      set(true)
      }} onPointerOut={(e) => {
        document.body.style.cursor = "auto";
        set(false)
        }}>
      <planeGeometry />
      <meshBasicMaterial color={lcolor} />
    </mesh>
  )
}

function Page({...props}) {
  const { width, height } = useThree((state) => state.viewport)
  const data = useScroll()
  const group = useRef()
  const img = useRef()
  const url=require('./test.jpg')
  useFrame(() => {
    group.current.children[1].position.y = 1 + data.range(0, 1 / 3)
    group.current.children[4].position.y = -data.offset * height * 5 + height
  })
  return (
    <>
      <group ref={group}>
        <Plane scale={[width/1.75,width/1.75/1.75,1]} color="hsl(139, 38%, 82%)" position={[0, 1, 0]}/>
        <Image onClick={(e)=>document.location="https://helloparthshah.github.io"} scale={[6,6,1]} ref={img} url={url}/>
        <Plane scale={[7,7,1]} color="hsl(139, 38%, 82%)" position={[0, -height,0]}/>
        <Plane scale={[7,7,1]} color="hsl(139, 38%, 82%)" position={[0, -height*2,0]}/>
        <Plane scale={[100, width/2, 1]} rotation={[0, 0, Math.PI / 4]} position={[0, height, -1]} color="hsl(177, 51%, 93%)" />
      </group>
    </>
  )
}

function App() {
  return (
    <>
      <Canvas linear flat orthographic camera={{ zoom: state.zoom, position: [0, 0, 20] }}>
        <ScrollControls pages={state.pages}>
          <Scroll>
            <Page />
          </Scroll>
          <Scroll html>
            <h1>Hello there</h1>
          </Scroll>
        </ScrollControls>
      </Canvas>
    </>
  )
}

export default App;
