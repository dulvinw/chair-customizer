import {Model} from "./models/model.ts";

interface PreferencesProps {
    selectedModel: Model;
    onChange: (mesh: string, texturePath: string) => void;
}

export const Preferences = ({selectedModel, onChange} : PreferencesProps)  => {
    return (
        selectedModel.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="section">
                <h2>{section.description}</h2>
                <div className="texture-selector">
                    {section.textures.map((texture) => (
                        <div key={texture.name} className="texture-item">
                            <img
                                src={texture.thumbnailPath}
                                alt={texture.name}
                                className="texture-thumbnail"/>
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
        ))
    )
}