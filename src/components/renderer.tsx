import * as THREE from 'three';
import { useEffect, useRef } from "react";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Props {
  modelPath: string;
  texturePath: string;
  meshName: string;
}

const assetsPathPrefix: string = '../assets/';

const Renderer: React.FC<Props> = ({ modelPath, texturePath, meshName }) => {
  const refContainer = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!refContainer.current) return;

    const modelUrl = new URL(assetsPathPrefix + modelPath, import.meta.url);
    const textureUrl = new URL(assetsPathPrefix + texturePath, import.meta.url);
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xFFFFFF);

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    directionalLight.position.set(10, 11, 7);

    const scene = new THREE.Scene();
    scene.add(ambientLight);
    scene.add(directionalLight);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(4, 2.5, 4);

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();

    refContainer.current.appendChild(renderer.domElement);
    const assetLoader = new GLTFLoader();
    assetLoader.load(modelUrl.href, function (gltf) {
      const model = gltf.scene;
      modelRef.current = model;

      model.position.set(1.5, -0.2, 1.5);
      scene.add(model);

      const material1 = new THREE.MeshStandardMaterial();

      const mesh = model.getObjectByName(meshName) as THREE.Mesh;
      if (mesh) {
        mesh.material = material1;

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(textureUrl.href);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);

        material1.map = texture;
        material1.needsUpdate = true;
      }
    }, undefined, function (error) {
      console.error(error);
    });

    function animate() {
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.002;
      }
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();
    renderer.setSize(window.innerWidth * 0.75, window.innerHeight * 0.75, false);

    return () => {
      renderer.dispose();
      refContainer.current?.removeChild(renderer.domElement);
    };
  }, [texturePath, modelPath]);

  return (
    <div ref={refContainer}></div>
  );
}

export default Renderer;
