import React from "react";
import { Routes, Route   } from "react-router-dom";

// Pages
import Home from "../pages/Home";
import Settings from "../pages/Settings";
import Artist from "../pages/Artist";
import Artists from "../pages/Artists";
import Albums from "../pages/Albums";
import Album from "../pages/Album";

export default function RoutesCustom(props) {
  const { user, setReloadApp, playerSong } = props;
  return (
    <Routes>
      <Route path="/" exact element={<Home playerSong={playerSong} />}/>
      <Route path="/artists" exact element={ <Artists />}/>
      <Route path="/artist/:id" exact element={ <Artist playerSong={playerSong} />}/>
      <Route path="/albums" exact element={ <Albums />}/>
      <Route path="/album/:id" exact element={  <Album playerSong={playerSong} />}/>
      <Route path="/settings" exact element={ <Settings user={user} setReloadApp={setReloadApp} />}/>
    </Routes>
  );
}
