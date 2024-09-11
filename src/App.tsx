import { useState } from 'react';
import './App.css';
import Renderer from './components/renderer';
import modelsJson from './models/models.json';
import { Model } from './models/model';

function App() {
  const [selectedModelName, setSelectedModelName] = useState(modelsJson[0].name);
  const selectedModel: Model = modelsJson.find(x => x.name === selectedModelName) as Model;

  const [preference, setPreference] = useState(
    selectedModel.sections.map((section) => {
      const selectedTexture = section.textures.length > 0 ? section.textures[0].path : '';
      return {
        meshName: section.meshName,
        selectedTextures: selectedTexture,
      };
    })
  );

  function onChange(mesh, texturePath) {
    setPreference((x) =>
      x.map((preference) =>
        preference.meshName === mesh
          ? { ...preference, selectedTextures: texturePath }
          : preference
      )
    );
  }

  function handleModelChange(event) {
    const newModelName = event.target.value;
    setSelectedModelName(newModelName);
    const newModel = modelsJson.find(x => x.name === newModelName) as Model;

    setPreference(
      newModel.sections.map((section) => {
        const selectedTexture = section.textures.length > 0 ? section.textures[0].path : '';
        return {
          meshName: section.meshName,
          selectedTextures: selectedTexture,
        };
      })
    );
  }

  return (
    <div>
      <div className="dropdown-container">
        <label htmlFor="model-select">Select a chair: </label>
        <select id="model-select" value={selectedModelName} onChange={handleModelChange}>
          {modelsJson.map((model) => (
            <option key={model.name} value={model.name}>
              {model.name}
            </option>
          ))}
        </select>
      </div><div className="app-container">
        <div className="sections-container">
          {selectedModel.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="section">
              <h2>{section.description}</h2>
              <div className="texture-selector">
                {section.textures.map((texture) => (
                  <div key={texture.name} className="texture-item">
                    <img
                      src={texture.thumbnailPath}
                      alt={texture.name}
                      className="texture-thumbnail" />
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
          <Renderer selectedModel={selectedModel} pref={preference} />
        </div>
      </div>
    </div>
  );
}

export default App;
