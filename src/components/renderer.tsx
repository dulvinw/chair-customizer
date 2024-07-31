import * as THREE from 'three';
import { useEffect, useRef } from "react";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function Renderer() {
  const refContainer = useRef(null);

  useEffect(() => {
    if (!refContainer.current) return;

    const fileUrl = new URL('../assets/old-chair.glb', import.meta.url);
    const grid = new THREE.GridHelper(100, 100);
    const ambientLight = new THREE.AmbientLight(0xededed, 0.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xA3A3A3);

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    directionalLight.position.set(10, 11, 7);

    const scene = new THREE.Scene();
    scene.add(grid);
    scene.add(ambientLight);
    scene.add(directionalLight);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(10, 10, 10);

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();

    refContainer.current.appendChild(renderer.domElement);

    const assetLoader = new GLTFLoader();
    assetLoader.load(fileUrl.href, function (gltf) {
      const model = gltf.scene;
      console.log(model);

      scene.add(model);

      // const material1 = new THREE.MeshStandardMaterial();
      // material1.color.setHex(0x6482AD);
      // (model.getObjectByName('mesh_0') as THREE.Mesh).material = material1;

      // const material2 = new THREE.MeshStandardMaterial();
      // material2.color.setHex(0xE2DAD6);
      // (model.getObjectByName('chair002') as THREE.Mesh).material = material2;

    }, undefined, function (error) {
      console.error(error);
    });

    function animate() {
      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);
    renderer.setSize(window.innerWidth * 0.75, window.innerHeight * 0.75, false);

    return () => {
      renderer.dispose();
      refContainer.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={refContainer}></div>
  );
}

export default Renderer;