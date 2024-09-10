import { OrbitControls } from "@react-three/drei";
import { Avatar } from "./Avatar";
{/*import { Text } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat"; 

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
  };*/}

export const Experience = () => {
  

  return (
    <>
      <OrbitControls enableRotate={false} />
      {/*<Suspense>
        <Dots position-y={1.75} position-x={-0.02} />
      </Suspense>*/}
      <Avatar position={[0, -6.9, 6]} rotation={[-Math.PI / 16, 0, 0]} scale={5} />  
      <ambientLight intensity={3.0} />
    </>
  );
};