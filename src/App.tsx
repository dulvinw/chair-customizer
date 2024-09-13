import {ChangeEvent, useEffect, useState} from 'react';
import './App.css';
import Renderer from './components/Renderer.tsx';
import modelsJson from './models/models.json';
import {Model} from './models/model';
import {Preferences} from "./Preferences.tsx";

const getOptions = () => modelsJson.map((model) => (
    <option key={model.name} value={model.name}>
        {model.name}
    </option>
));

const getModelPreferences = (model: Model) => model.sections.map((section) => {
    const selectedTexture = section.textures.length > 0 ? section.textures[0].path : '';
    return {
        meshName: section.meshName,
        selectedTextures: selectedTexture,
    };
});

export interface IPreferences {
    meshName: string;
    selectedTextures: string;
}

function App() {
    const [selectedModel, setSelectedModel] = useState<Model>();
    const [preferences, setPreferences] = useState<IPreferences[]>();

    useEffect(() => {
        const modelName = modelsJson[0].name;
        const selectedModel: Model = modelsJson.find(x => x.name === modelName) as Model;
        const modelPreferences = getModelPreferences(selectedModel);

        setPreferences(modelPreferences);
        setSelectedModel(selectedModel);
    }, [])

    const onPreferenceChange = (mesh: string, selectedTextures: string) => {
        const updateFromPreviousPref = (prevPref: IPreferences[]) => {
            const unchangedMeshes = prevPref.filter((pref) => pref.meshName !== mesh);
            const changedMesh = prevPref.filter((pref) => pref.meshName === mesh).map((pref) => ({
                ...pref,
                selectedTextures
            }));

            return unchangedMeshes.concat(changedMesh);
        };

        setPreferences(updateFromPreviousPref);
    }

    const onModelChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const modelName = event.target.value;
        const model = modelsJson.find(x => x.name === modelName) as Model;

        const modelPreferences = getModelPreferences(model);
        setPreferences(modelPreferences);
        setSelectedModel(model);
    };

    if (!selectedModel) {
        return null;
    }

    console.log(preferences);

    return (
        <div>
            <div className="dropdown-container">
                <label htmlFor="model-select">Select a chair: </label>
                <select id="model-select" value={selectedModel.name} onChange={onModelChange}>
                    {getOptions()}
                </select>
            </div>
            <div className="app-container">
                <div className="sections-container">
                    <Preferences selectedModel={selectedModel} onChange={onPreferenceChange}/>
                </div>
                <div className="renderer-container">
                    <Renderer selectedModel={selectedModel} pref={preferences}/>
                </div>
            </div>
        </div>
    );
}

export default App;