import React from 'react';

interface SceneDescriptionProps {
  description: string;
}

const SceneDescription: React.FC<SceneDescriptionProps> = ({ description }) => {
  return (
    <div className="scene-description">
      {description.split('\n').map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  );
};

export default SceneDescription;
