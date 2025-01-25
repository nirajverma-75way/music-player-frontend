import { Route, Routes } from "react-router-dom";
import Basic from "./layouts/Basic";
import Home from "./pages/homepage";
import Post from "./pages/post";
import Authenticate from "./pages/authenticate";
import PostById from "./pages/post/postById";
import User from "./pages/user";
function App() {
  return (
    <Routes>
      <Route element={<Basic />}>
      <Route path="/" element={<Home />} />
      <Route path="/post" element={<Post />} />
      <Route path="/post/:id" element={<PostById />} />
      <Route path="/user" element={<User />} />
      <Route path="/authenticate" element={<Authenticate />} />
      </Route>
    </Routes>
  );
}

export default App;
