import React, { useState, useEffect } from "react";
import  firebase from "../../utils/FirebaseCustom";
import "firebase/storage";
import { getStorage, ref ,getDownloadURL} from "firebase/storage";
import "./BannerHome.scss";

export default function BannerHome() {
  const [bannerUrl, setBannerUrl] = useState(null);

  useEffect(() => {
    // Create a reference with an initial file path and name
    const storage = getStorage();
    getDownloadURL(ref(storage, "other/banner-home.jpg")).then(url => {
      setBannerUrl(url);
        })
        .catch(() => {});
    
    // firebase
    //   .storage()
    //   .ref("other/banner-home.jpg")
    //   .getDownloadURL()
    //   .then(url => {
    //     setBannerUrl(url);
    //   })
    //   .catch(() => {});
  }, []);

  if (!bannerUrl) {
    return null;
  }

  return (
    <div
      className="banner-home"
      style={{ backgroundImage: `url('${bannerUrl}')` }}
    />
  );
}
