import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectPrompt from './components/ProjectPrompt';
import ProjectRequirementsManager from './components/ProjectRequirementsManager';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectPrompt />} />
        <Route path="/requirements-gathering" element={<ProjectRequirementsManager />} />
      </Routes>
    </Router>
  );
}

export default App;
