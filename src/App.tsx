import { Route, Routes } from "react-router-dom";
import Basic from "./layouts/Basic";
import Home from "./pages/homepage";
import Post from "./pages/post/indesx";
import Authenticate from "./pages/authenticate";
function App() {
  return (
    <Routes>
      <Route element={<Basic />}>
      <Route path="/" element={<Home />} />
      <Route path="/post" element={<Post />} />
      <Route path="/authenticate" element={<Authenticate />} />
      </Route>
    </Routes>
  );
}

export default App;
