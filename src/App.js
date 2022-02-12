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

function Plane({hoverable=false, color = "white", ...props }) {
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
      if (hoverable) {
        document.body.style.cursor = "pointer";
        set(true)
      }
      }} onPointerOut={(e) => {
      if (hoverable) {
        document.body.style.cursor = "auto";
        set(false)
      }
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
  const size = [width / 1.75, width / 1.75 / 1.75, 1]
  useFrame(() => {
    group.current.children[0].rotation.z = data.range(0, 1 / 2 * Math.PI)
    group.current.children[2].rotation.z = -data.range(0, 1 / 2 * Math.PI)
    group.current.children[3].rotation.z = data.range(0, 1 / 2 * Math.PI)
    group.current.children[1].position.y = 1 + data.range(0, 1 / 3)
    group.current.children[4].position.y = -data.offset * height * 5 + height*1.3
  })
  return (
    <>
      <group ref={group}>
        <Plane scale={size} color="hsl(139, 38%, 82%)" position={[0, 1, 0]} hoverable={true}/>
        <Image onClick={(e)=>document.location="https://helloparthshah.github.io"} scale={[width / 1.75-1,width / 1.75 / 1.75-1,1]} ref={img} url={url}/>
        <Plane scale={size} color="hsl(139, 38%, 82%)" position={[0, -height,0]}/>
        <Plane scale={size} color="hsl(139, 38%, 82%)" position={[0, -height*2,0]}/>
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
