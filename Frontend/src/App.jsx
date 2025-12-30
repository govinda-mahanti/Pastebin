import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GetContent from "./Pages/GetContent";
import PasteContent from "./Pages/PasteContent";
const App = () => {
  return (
    <Router>
      <Routes>
          <Route path="/paste/:id" element={<GetContent />} />
          <Route path="/" element={<PasteContent />} />       
      </Routes>
    </Router>
  );
}

export default App;
