import * as THREE from 'three';
import React, {useEffect, useRef} from "react";
import {Model} from '../models/model';
import {IPreferences} from "../App.tsx";
import {setupAssetLoader} from "./SetupAssetLoader.tsx";
import {addLights, getCamera, getRenderer, setupOrbit} from "./SceneUtils.tsx";

interface Props {
    selectedModel: Model;
    pref: IPreferences[]
}

const ASSET_PATH_PREFIX: string = '/assets/';

const Renderer: React.FC<Props> = ({selectedModel, pref}) => {
    const refContainer = useRef<HTMLDivElement | null>(null);
    const modelRef = useRef<THREE.Group | null>(null);
    const stopSpinningRef = useRef<boolean>(false);

    useEffect(() => {
        if (!refContainer.current) return;
        const modelUrl = new URL(ASSET_PATH_PREFIX + selectedModel.name, import.meta.url);

        const scene = new THREE.Scene();
        const camera = getCamera(selectedModel);
        const renderer = getRenderer();

        addLights(scene);
        setupOrbit(camera, renderer, stopSpinningRef);

        const currentRef = refContainer.current;
        currentRef.appendChild(renderer.domElement);
        console.log(currentRef);

        // Load the model
        setupAssetLoader(modelUrl, modelRef, selectedModel, scene, pref);

        const planeGeometry = new THREE.PlaneGeometry(500, 500);
        const planeMaterial = new THREE.ShadowMaterial({opacity: 0.5});
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);

        plane.rotation.x = -Math.PI / 2;
        plane.position.y = selectedModel.modelPosition.y;

        plane.receiveShadow = true;
        scene.add(plane);

        const animate = () => {
            if (modelRef.current && !stopSpinningRef.current) {
                modelRef.current.rotation.y += 0.002;
            }

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();
        renderer.setSize(window.innerWidth * 0.75, window.innerHeight * 0.75, false);

        return () => {
            renderer.dispose();
            currentRef.removeChild(renderer.domElement);
        };
    }, [pref, selectedModel]);

    return (
        <div ref={refContainer}></div>
    );
}

export default Renderer;
