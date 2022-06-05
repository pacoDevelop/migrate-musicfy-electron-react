import React, { useState, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { map } from "lodash";
import { Link } from "react-router-dom";
import  firebase,{ getDb } from "../../utils/FirebaseCustom";
import "firebase/firestore";
import { getDocs,collection } from "firebase/firestore";
import "./Artists.scss";
import { getStorage, ref,getDownloadURL } from "firebase/storage";
const db = getDb();

export default function Artists() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    
 const docRef = collection(getDb(), "artists");
  
    getDocs(docRef).then(response => {
        const arrayArtists = [];
        map(response?.docs, artist => {
          const data = artist.data();
          data.id = artist.id;
          arrayArtists.push(data);
        });
        setArtists(arrayArtists);
      });
    // db.collection("artists")
    //   .get()
    //   .then(response => {
    //     const arrayArtists = [];
    //     map(response?.docs, artist => {
    //       const data = artist.data();
    //       data.id = artist.id;
    //       arrayArtists.push(data);
    //     });
    //     setArtists(arrayArtists);
    //   });
  }, []);

  return (
    <div className="artists">
      <h1>Artistas</h1>
      <Grid>
        {map(artists, artist => (
          <Grid.Column key={artist.id} mobile={8} tablet={4} computer={3}>
            <Artist artist={artist} />
          </Grid.Column>
        ))}
      </Grid>
    </div>
  );
}

function Artist(props) {
  const { artist } = props;
  const [bannerUrl, setBannerUrl] = useState(null);

  useEffect(() => {
    

   const storage = getStorage();
   getDownloadURL(ref(storage, `artist/${artist.banner}`)).then(url => {
        setBannerUrl(url);
      });
 
    // firebase
    //   .storage()
    //   .ref(`artist/${artist.banner}`)
    //   .getDownloadURL()
    //   .then(url => {
    //     setBannerUrl(url);
    //   });
  }, [artist]);

  return (
    <Link to={`/artist/${artist.id}`}>
      <div className="artists__item">
        <div
          className="avatar"
          style={{ backgroundImage: `url('${bannerUrl}')` }}
        />
        <h3>{artist.name}</h3>
      </div>
    </Link>
  );
}
