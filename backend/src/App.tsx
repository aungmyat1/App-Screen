
// Ensure all necessary components are imported
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Routes>
        // Ensure routes are correctly defined
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        // Add other routes as needed
      </Routes>
    </Router>
  );
}

export default App;
