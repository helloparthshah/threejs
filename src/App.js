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

function Plane({color = "white", ...props }) {
  return (
    <mesh {...props}>
      <planeGeometry />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

function Project({
  isHover = false,
  number = 0,
  ...props
}) {
  const { width, height } = useThree((state) => state.viewport)
  const [hovered, set] = useState(false)
  const color = "hsl(267, 68%, 55%)"
  const lcolor = "hsl(267, 68%, 60%)"
  const size = [width / 2, width / 3.5, 1]
  const data = useScroll()
  const ref= useRef()
  useFrame(() => {
    ref.current.children[0].rotation.z = (number%2===0?-1:1)*data.range(0, Math.PI)
  })
  return (
    <group ref={ref}>
    <Plane {...props} position={[(number%2===0?-1:1)*width/6, 1+number*-height, 0]} 
        color={hovered?lcolor:color} scale={size} onPointerOver={(e) => {
        document.body.style.cursor = "pointer";
        set(true)
      }} onPointerOut={(e) => {
        document.body.style.cursor = "auto";
        set(false)
        }}/>
        </group>
  )
}

function Page({...props}) {
  const { width, height } = useThree((state) => state.viewport)
  const data = useScroll()
  const group = useRef()
  useFrame(() => {
    group.current.children[3].position.y = -data.offset * height * 5 + height*1.3
  })
  return (
    <>
      <group ref={group}>
        <Project number={0}/>
        <Project number={1}/>
        <Project number={2}/>
        <Plane scale={[100, width/2, 1]} rotation={[0, 0, Math.PI / 4]} position={[0, height, -1]} color="#131313" />
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
