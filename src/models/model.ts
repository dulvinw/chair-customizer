export interface Texture {
    name: string;
    path: string;
    thumbnailPath: string;
}

export interface Section {
    description: string;
    meshName: string;
    textures: Texture[];
}

export interface Position {
    x: number,
    y: number,
    z: number
}

export interface Model {
    name: string;
    cameraPosition: Position;
    modelPosition: Position;
    sections: Section[];
}
