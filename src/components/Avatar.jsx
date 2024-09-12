import { useAnimations, useGLTF, useFBX } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { button, useControls } from "leva";
import React, { useEffect, useMemo, useRef, useState } from "react";

import * as THREE from "three";
{/*import { useChat } from "../hooks/useChat";*/}

const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};



let setupMode = false;

export function Avatar(props) {
  const { playAudio, script} = useControls({
    playAudio: false,
    script: {
      value: "Welcome2",
    }
  })

  const audio = useMemo(() => new Audio(`/audios/${script}.mp3`), [script]);
  const jsonFile = useLoader(THREE.FileLoader, `audios/${script}.json`);
  const lipsync = JSON.parse(jsonFile);

  useFrame(() => {
    const currentAudioTime = audio.currentTime;
    if (audio.paused || audio.ended) {
      setAnimation("Idle");
    }

    Object.values(corresponding).forEach((value) => {
      nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[value]] = 0;
      nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[value]] = 0;
    });

    for (let i = 0; i < lipsync.mouthCues.length; i++) {
      const mouthCue = lipsync.mouthCues[i];
      if (
        currentAudioTime >= mouthCue.start && 
        currentAudioTime <= mouthCue.end
      ) {
        console.log(mouthCue.value);
        nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]] = 1;
        nodes.Wolf3D_Teeth.morphTargetInfluences[nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[mouthCue.value]]] = 1;
      break ;
      }
    }
  });

  

  useEffect(() => {
    if (playAudio) {
      audio.play()
        .then(() => {
          if (script === "Welcome2") {
            setAnimation("Idle");
          }
        })
        .catch((error) => {
          console.error('Audio playback failed:', error);
        });
    } else {
      setAnimation("Idle");
      audio.pause();
    }
  }, [playAudio, script]);

  const { nodes, materials, scene } = useGLTF('models/66db0f2bcb21e99019447727.glb');
  const { animations: idleAnimation } = useFBX('/animations/Standing Idle.fbx');
  const { animations: greetingAnimation } = useFBX('/animations/Standing Greeting.fbx');
  
  idleAnimation[0].name = "Idle";
  greetingAnimation[0].name = "Greeting";

  const [animation, setAnimation] = useState("Idle");

  const group = useRef();
  const {actions} = useAnimations([idleAnimation[0], greetingAnimation[0]], 
    group
  );

  useEffect(() => {
    console.log(nodes.Wolf3D_Head.morphTargetDictionary);
  }, []);

  useEffect(() => {
    actions[animation].reset().fadeIn(0.5).play();
    return () => actions[animation].fadeOut(0.5);
  }, [animation]);

  const lerpMorphTarget = (target, value, speed = 0.5) => {
    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (
          index === undefined ||
          child.morphTargetInfluences[index] === undefined
        ) {
          return;
        }
        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          child.morphTargetInfluences[index],
          value,
          speed
        );

        if (!setupMode) {
          try {
            set({
              [target]: value,
            });
          } catch (e) {}
        }
      }
    });
  };

  const [blink, setBlink] = useState(false);

  

  lerpMorphTarget("eyeBlinkLeft", blink ? 1 : 0, 0.9 );
  lerpMorphTarget("eyeBlinkRight", blink ? 1 : 0, 0.9);

  Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
    if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
      return; // eyes wink/blink are handled separately
    }
    const value =
          nodes.EyeLeft.morphTargetInfluences[
            nodes.EyeLeft.morphTargetDictionary[key]
          ];
        if (value > 0.1) {
          emotionValues[key] = value;
        }
  });

  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);


  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Glasses.geometry}
        material={materials.Wolf3D_Glasses}
        skeleton={nodes.Wolf3D_Glasses.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
    </group>
  )
}



useGLTF.preload("/models/66db0f2bcb21e99019447727.glb");
useFBX.preload("/animations/Standing Idle.fbx");