import * as THREE from "three";
import {PerspectiveCamera, Scene, WebGLRenderer} from "three";
import React from "react";
import {Model} from "../models/model.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

export const setupOrbit = (camera: PerspectiveCamera, renderer: WebGLRenderer, stopSpinningRef: React.MutableRefObject<boolean>) => {
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();

    orbit.addEventListener('start', () => {
        stopSpinningRef.current = true;
    });

    orbit.addEventListener('end', () => {
        stopSpinningRef.current = false;
    });
};
export const getDirectionalLight = () => {
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 5);
    directionalLight.position.set(10, 11, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    return directionalLight;
};
export const getAmbientLight = () => new THREE.AmbientLight(0xFFFFFF, 3);
export const addLights = (scene: Scene) => {
    scene.add(getAmbientLight());
    scene.add(getDirectionalLight());
};
export const getCamera = (selectedModel: Model) => {
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(
        selectedModel.cameraPosition.x,
        selectedModel.cameraPosition.y,
        selectedModel.cameraPosition.z
    );
    return camera;
};
export const getRenderer = () => {
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0xFFFFFF);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    return renderer;
};