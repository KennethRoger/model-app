import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/home" element={<h1 className="text-gray-600">Home page</h1>} />
      </Routes>
    </>
  );
}

export default App;