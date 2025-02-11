import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Basic from "./layouts/Basic";
import ProtectedRoute from "./component/protectedRoute";
import Loading from "./component/loading";
import Layout from "./layouts/layout";
import LazyComponent from "./component/LazyComponent";
import NotFoundPage from "./pages/notFoundPage";

const HomePage = React.lazy(() => import("./pages/homepage"));
const Authenticate = React.lazy(() => import("./pages/authenticate"));
const SongPage = React.lazy(() => import("./pages/song"));
const PlaylistPage = React.lazy(() => import("./pages/playlist"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Basic />}>
          <Route path="/authenticate" element={<Authenticate />} />
        </Route>

        <Route element={<ProtectedRoute><Layout role={"ADMIN"} /></ProtectedRoute>}>
          <Route path="/" element={<HomePage />} />
          <Route path="/songs" element={<LazyComponent><SongPage /></LazyComponent>} />
          <Route path="/playlists" element={<LazyComponent><PlaylistPage /></LazyComponent>} />
          <Route path="/*" element={<LazyComponent><NotFoundPage /></LazyComponent>} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
