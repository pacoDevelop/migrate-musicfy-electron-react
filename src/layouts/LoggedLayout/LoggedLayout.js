import React, { useState } from "react";
import { Grid } from "semantic-ui-react";
import { HashRouter as Router } from "react-router-dom";
import RoutesCustom from "../../routes/Routes";
import MenuLeft from "../../components/MenuLeft";
import TopBar from "../../components/TopBar";
import Player from "../../components/Player";
import  firebase from "../../utils/FirebaseCustom";
import "firebase/storage";
import { getStorage, ref,getDownloadURL } from "firebase/storage";
import "./LoggedLayout.scss";

export default function LoggedLayout(props) {
  const { user, setReloadApp } = props;
  const [songData, setSongData] = useState(null);

  const playerSong = (albumImage, songName, songNameFile) => {
    

   const storage = getStorage();
   getDownloadURL(ref(storage, `song/${songNameFile}`)).then(url => {
        setSongData({ url, image: albumImage, name: songName });
      });
    // firebase
    //   .storage()
    //   .ref(`song/${songNameFile}`)
    //   .getDownloadURL()
    //   
  };

  return (
    <Router>
      <Grid className="logged-layout">
        <Grid.Row>
          <Grid.Column width={3}>
            <MenuLeft user={user} />
          </Grid.Column>
          <Grid.Column className="content" width={13}>
            <TopBar user={user} />
            <RoutesCustom
              user={user}
              setReloadApp={setReloadApp}
              playerSong={playerSong}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Player songData={songData} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Router>
  );
}
