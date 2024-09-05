import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
{/*import { UI } from "./components/UI";
import { Leva } from "leva";
import { Loader } from "@react-three/drei"; */}


function App() {
  return (
    <>
      {/*<Loader />
      <Leva />
      <UI />*/}
      <Canvas shadows camera={{ position: [0, 6, 17], fov: 15 }}>
        <color attach="background" args={["#ececec"]} />
        <Experience />
      </Canvas>
    </>
  );
}

export default App;
