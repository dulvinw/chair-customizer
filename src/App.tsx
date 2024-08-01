import { useState } from 'react';
import './App.css';
import Renderer from './components/renderer';
import modelsJson from './models/models.json';
import { Model } from './models/model';

function App() {
  const model: Model = modelsJson[0] as Model;
  const [selectedTexture, setSelectedTexture] = useState(model.sections[0].textures[0].path);
  const [selectedMesh, setSelectedMesh] = useState(model.sections[0].meshName);
  

  function onChange(mesh, texturePath) {
    setSelectedMesh(mesh);
    setSelectedTexture(texturePath);
  }

  return (
    <div className="app-container">
      <div className="sections-container">
        {model.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="section">
            <h2>{section.description}</h2>
            <div className="texture-selector">
              {section.textures.map((texture) => (
                <div key={texture.name} className="texture-item">
                  <img
                    src={texture.thumbnailPath}
                    alt={texture.name}
                    className="texture-thumbnail"
                  />
                  <button
                    className="texture-button"
                    onClick={() => onChange(section.meshName, texture.path)}
                  >
                    {texture.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="renderer-container">
        <Renderer modelPath={model.name} texturePath={selectedTexture} meshName={selectedMesh} />
      </div>
    </div>
  );
}

export default App;
