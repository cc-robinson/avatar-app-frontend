import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
{/*import { Leva } from "leva";*/}
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";

{/*function App() {
  return (
    <>
      <Loader />
      <Leva hidden/>
      <UI />
      <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
        <Experience />
      </Canvas>
    </>
  );
}

export default App; */}




function App() {
  return (
    <>
      <Loader />
      <UI />
      <Canvas shadows camera={{ position: [0, 6, 17], fov: 15 }}>
        <color attach="background" args={["#ececec"]} />
        <Experience />
      </Canvas>
    </>
  );
}

export default App;
