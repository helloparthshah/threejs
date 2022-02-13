import * as THREE from "three";
import ReactDOM from "react-dom";
import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import state from "./store";
import {
  Html,
  useScroll,
  Scroll,
  ScrollControls,
  Image,
  Text,
} from "@react-three/drei";
import "./App.css";

function Plane({ color = "white", ...props }) {
  return (
    <mesh {...props}>
      <planeGeometry />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function Project({ isHover = false, number = 0, ...props }) {
  let { width, height } = useThree((state) => state.viewport);
  const [h, setH] = useState(height);
  const [w, setW] = useState(width);
  const [hovered, set] = useState(false);
  const color = "hsl(41, 87%, 52%)";
  const lcolor = "hsl(41, 87%, 58%)";
  const size = [w / 2, w / 3.5, 1];
  const data = useScroll();
  const ref = useRef();
  useEffect(() => {
    if (width <= 10) {
      state.pages = (10 * state.pages) / height;
      setH(10);
    }
  }, [height, width]);
  useFrame(() => {
    let rot =
      ((number % 2 === 0 ? -1 : 1) *
        data.range(number / state.pages, (number + 1) / state.pages) *
        1) /
      3;
    ref.current.children[0].rotation.z = rot;
  });
  return (
    <group ref={ref}>
      <Plane
        {...props}
        position={[((number % 2 === 0 ? -1 : 1) * w) / 5, 1 + number * -h, 0]}
        color={hovered ? lcolor : color}
        scale={size}
        onPointerOver={(e) => {
          document.body.style.cursor = "pointer";
          set(true);
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = "auto";
          set(false);
        }}
      />
      <Html
        wrapperClass="html"
        width={w / 2}
        position={[
          ((number % 2 === 0 ? 1 : -1) * w) / 5,
          number * -h + size[1] / 2,
          0,
        ]}
      >
        hello world!
      </Html>
    </group>
  );
}

function Page({ ...props }) {
  const { width, height } = useThree((state) => state.viewport);
  const data = useScroll();
  const group = useRef();
  const html = useRef();
  const stripeWidth = height;

  useFrame(() => {
    group.current.children[3].position.y =
      -data.offset * height * (state.pages + 2) + stripeWidth;
  });

  useFrame(({ mouse }) => {
    let x = THREE.MathUtils.lerp(
      html.current.style.top.replace("px", ""),
      (mouse.y - data.offset) * height * 5,
      0.1
    );
    let y = THREE.MathUtils.lerp(
      html.current.style.left.replace("px", ""),
      -mouse.x * width * 5,
      0.1
    );
    html.current.style.top = `${x}px`;
    html.current.style.left = `${y}px`;
  });

  return (
    <>
      <group ref={group} {...props}>
        <Project number={1} />
        <Project number={2} />
        <Project number={3} />
        <Plane
          scale={[100, stripeWidth, 1]}
          rotation={[0, 0, Math.PI / 4]}
          position={[0, 0, -1]}
          color="#131313"
        />
        <Html ref={html} center wrapperClass="html">
          <h1 id={"name"} style={{ fontSize: "6em" }}>
            Parth Shah
          </h1>
        </Html>
      </group>
    </>
  );
}

function App() {
  return (
    <>
      <Canvas
        invalidateFrameloop
        linear
        flat
        orthographic
        camera={{ zoom: state.zoom, position: [0, 0, 20] }}
      >
        <ScrollControls pages={state.pages} damping={4}>
          <Scroll>
            <Page />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </>
  );
}

export default App;
