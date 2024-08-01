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

export interface Model {
    name: string;
    sections: Section[];
}