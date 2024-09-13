import React from "react";
import * as THREE from "three";
import {Group, Scene} from "three";
import {Model} from "../models/model.ts";
import {IPreferences} from "../App.tsx";
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

export const setupAssetLoader = (modelUrl: URL, modelRef: React.MutableRefObject<Group | null>, selectedModel: Model, scene: Scene, pref: IPreferences[]) => {
    const assetLoader = new GLTFLoader();
    assetLoader.load(modelUrl.href, function (gltf: GLTF) {
        const model: Group = gltf.scene;
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

        const replaceTexture = (mesh, newTextureURL) => {
            if (mesh.material.map) {
                textureLoader.load(newTextureURL, (newTexture) => {
                    const oldTexture = mesh.material.map;
                    oldTexture.image = newTexture.image;
                    mesh.material.map = oldTexture;
                    mesh.material.needsUpdate = true;
                });
            }
        };
        const textureLoader = new THREE.TextureLoader();

        pref.forEach(x => {
            const mesh = model.getObjectByName(x.meshName) as THREE.Mesh;
            if (mesh) {
                const texturePath = pref.find(x => x.meshName === mesh.userData.name).selectedTextures;
                replaceTexture(mesh, 'src/assets/' + texturePath);
                console.log(texturePath, mesh.userData.name);
            }
        });
    }, undefined, function (error) {
        console.error(error);
    });
};