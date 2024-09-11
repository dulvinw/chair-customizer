import * as THREE from 'three';
import { useEffect, useRef } from "react";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Model } from '../models/model';

interface Props {
  selectedModel: Model;
  pref: any[]
}

const assetsPathPrefix: string = '../assets/';

const Renderer: React.FC<Props> = ({ selectedModel, pref }) => {
  const refContainer = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const stopSpinningRef = useRef<boolean>(false);

  useEffect(() => {
    if (!refContainer.current) return;
  
    const modelUrl = new URL(assetsPathPrefix + selectedModel.name, import.meta.url);
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 3);
  
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xFFFFFF);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 5);
    directionalLight.position.set(10, 11, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
  
    const scene = new THREE.Scene();
    scene.add(ambientLight);
    scene.add(directionalLight);
  
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(
      selectedModel.cameraPosition.x,
      selectedModel.cameraPosition.y,
      selectedModel.cameraPosition.z
    );
  
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();
  
    orbit.addEventListener('start', () => {
      stopSpinningRef.current = true;
    });
  
    orbit.addEventListener('end', () => {
      stopSpinningRef.current = false;
    });
  
    refContainer.current.appendChild(renderer.domElement);
  
    // Load the model
    const assetLoader = new GLTFLoader();
    assetLoader.load(modelUrl.href, function (gltf) {
      const model = gltf.scene;
      modelRef.current = model;
  
      model.traverse((node) => {
        if ((node as THREE.Mesh).isMesh) {
          const mesh = node as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });
      
  
      model.position.set(
        selectedModel.modelPosition.x,
        selectedModel.modelPosition.y,
        selectedModel.modelPosition.z
      );
      scene.add(model);
  
      const textureLoader = new THREE.TextureLoader();
      pref.forEach(x => {
        const mesh = model.getObjectByName(x.meshName) as THREE.Mesh;
        if (mesh) {
          const texturePath = pref.find(x => x.meshName === mesh.userData.name).selectedTextures;
          replaceTexture(mesh, 'src/assets/' + texturePath);
          console.log(texturePath, mesh.userData.name);
        }
      });
  
      function replaceTexture(mesh, newTextureURL) {
        if (mesh.material.map) {
          textureLoader.load(newTextureURL, (newTexture) => {
            let oldTexture = mesh.material.map;
            oldTexture.image = newTexture.image;
            mesh.material.map = oldTexture;
            mesh.material.needsUpdate = true;
          });
        }
      }
    }, undefined, function (error) {
      console.error(error);
    });
  
    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = selectedModel.modelPosition.y;
  
    plane.receiveShadow = true;
    scene.add(plane);
  
    function animate() {
      if (modelRef.current && !stopSpinningRef.current) {
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
  }, [pref, selectedModel.name]);  

  return (
    <div ref={refContainer}></div>
  );
}

export default Renderer;
