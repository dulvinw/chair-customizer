import React, { useState } from 'react';
import './App.css';
import Renderer from './components/renderer';

const modelName = 'old-chair.glb';
const textures = [
  { name: 'Texture 1', path: 'texture1.jpg' },
  { name: 'Texture 2', path: 'texture2.jpg' },
  { name: 'Texture 3', path: 'texture3.jpg' },
];

function App() {
  const [selectedTexture, setSelectedTexture] = useState(textures[0].path);

  return (
    <div>
      <div className="texture-selector">
        {textures.map((texture) => (
          <button
            key={texture.name}
            onClick={() => setSelectedTexture(texture.path)}
          >
            {texture.name}
          </button>
        ))}
      </div>
      <Renderer modelPath={modelName} texturePath={selectedTexture} />
    </div>
  );
}

export default App;