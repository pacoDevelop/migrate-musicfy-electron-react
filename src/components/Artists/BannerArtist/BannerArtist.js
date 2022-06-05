import React, { useState, useEffect } from "react";
import  firebase from "../../../utils/FirebaseCustom";
import "firebase/storage";

import "./BannerArtist.scss";
import { getStorage, ref,getDownloadURL  } from "firebase/storage";

export default function BannerArtist(props) {
  const { artist } = props;
  const [bannerUrl, setBannerUrl] = useState(null);

  useEffect(() => {
    const storage = getStorage();
    getDownloadURL(ref(storage, `artist/${artist?.banner}`)).then(url => {
     setBannerUrl(url);
        });
    
    // firebase
    //   .storage()
    //   .ref(`artist/${artist?.banner}`)
    //   .getDownloadURL()
    //   .then(url => {
    //     setBannerUrl(url);
    //   });
  }, [artist]);

  return (
    <div
      className="banner-artist"
      style={{ backgroundImage: `url('${bannerUrl}')` }}
    >
      <div className="banner-artist__gradient" />
      <div className="banner-artist__info">
        <h4>ARTISTA</h4>
        <h1>{artist.name}</h1>
      </div>
    </div>
  );
}
