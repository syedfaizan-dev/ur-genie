import React, { createContext, useState, useContext } from 'react';

// Create the context
const ProjectPromptContext = createContext();

// Create a provider component
export function ProjectPromptProvider({ children }) {
  const [projectPrompt, setProjectPrompt] = useState('');

  return (
    <ProjectPromptContext.Provider value={{ projectPrompt, setProjectPrompt }}>
      {children}
    </ProjectPromptContext.Provider>
  );
}

// Custom hook for easy access
export function useProjectPromptContext() {
  return useContext(ProjectPromptContext);
}
