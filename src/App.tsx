import { useState } from 'react';
import './App.css';
import Renderer from './components/renderer';
import modelsJson from './models/models.json';
import { Model } from './models/model';

function App() {
  const model: Model = modelsJson.find(x => x.name === 'GreenChair.glb') as Model;
  const [preference, SetPreference] = useState(
    model.sections.map((section) => {
      const selectedTexture = section.textures.length > 0 ? section.textures[0].path : '';
      return {
        meshName: section.meshName,
        selectedTextures: selectedTexture,
      };
    })
  );

  function onChange(mesh, texturePath) {
    console.log(preference);

    SetPreference((x) =>
      x.map((preference) =>
        preference.meshName === mesh
          ? { ...preference, selectedTextures: texturePath }
          : preference
      )
    );
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
        <Renderer modelPath={model.name} pref={preference} />
      </div>
    </div>
  );
}

export default App;
