import React from 'react';

const ApiKeyPrompt: React.FC = () => {
  // Per coding guidelines, do not prompt for an API key.
  // The key must be set via the process.env.API_KEY environment variable.
  // This component returns null to prevent any UI from being rendered.
  return null;
};

export default ApiKeyPrompt;
