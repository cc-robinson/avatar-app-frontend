import {
  CameraControls,
  ContactShadows,
  Environment,
  Text,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { Avatar } from "./Avatar";
import { OrbitControls } from "@react-three/drei";

const Dots = (props) => {
  const { loading } = useChat();
  const [loadingText, setLoadingText] = useState("");
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingText((loadingText) => {
          if (loadingText.length > 2) {
            return ".";
          }
          return loadingText + ".";
        });
      }, 800);
      return () => clearInterval(interval);
    } else {
      setLoadingText("");
    }
  }, [loading]);
  if (!loading) return null;
  return (
    <group {...props}>
      <Text fontSize={0.14} anchorX={"left"} anchorY={"bottom"}>
        {loadingText}
        <meshBasicMaterial attach="material" color="black" />
      </Text>
    </group>
  );
};

export const Experience = () => {
  const cameraControls = useRef();
  

  useEffect(() => {
    cameraControls.current.setLookAt(0, 2, 5, 0, 1.3, 0);
  }, []);

 
  return (
    <>
      <CameraControls ref={cameraControls} />
      <Environment preset="sunset" />
      {/* Wrapping Dots into Suspense to prevent Blink when Troika/Font is loaded */}
      <Suspense>
        <Dots position-y={1.75} position-x={-0.02} />
      </Suspense>
      <Avatar position={[0, -1.5, 3]} rotation={[Math.PI/2, 0, 0]} scale={2}/>
      <ContactShadows opacity={0.7} />
    </>
  );
};


{/*
  
import { OrbitControls } from "@react-three/drei";
import { Avatar } from "./Avatar";

export const Experience = () => {  

  return (
    <>
      <OrbitControls enableRotate={false} />
      <Avatar position={[0, -6.9, 6]} rotation={[-Math.PI / 16, 0, 0]} scale={5} />  
      <ambientLight intensity={3.0} />
    </>
  );
};
*/}