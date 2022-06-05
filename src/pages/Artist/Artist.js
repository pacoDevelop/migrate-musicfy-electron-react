import React, { useState, useEffect } from "react";
import { withRouter } from "../../utils/withRouter";
import { map } from "lodash";
import BannerArtist from "../../components/Artists/BannerArtist";
import BasicSliderItems from "../../components/Sliders/BasicSliderItems";
import SongsSlider from "../../components/Sliders/SongsSlider";
import  { getDb } from "../../utils/FirebaseCustom";
import "firebase/firestore";
import {getDoc,doc, getDocs,collection ,query,where} from "firebase/firestore";
import "./Artist.scss";
import { useParams   } from "react-router-dom";

const db = getDb();

function Artist(props) {
  const { match, playerSong } = props;
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  let { id } = useParams(); 

  useEffect(() => {
    
 const docRef = doc(getDb(), "artists",id);
  
    getDoc(docRef).then(response => {
        // doc.data() is never undefined for query doc snapshots
        const data = response.data();
            data.id = response.id;
            setArtist(data);
      });
    // db.collection("artists")
    //   .doc(match?.params?.id)
    //   .get()
    //   .then(response => {
    //     const data = response.data();
    //     data.id = response.id;
    //     setArtist(data);
    //   });
  }, [match]);

  useEffect(() => {
    if (artist) {
 const docRef = collection(getDb(), "albums");
 const q = query(docRef,where("artist", "==", artist.id));
    getDocs(q).then(response => {
          const arrayAlbums = [];
          map(response?.docs, album => {
            const data = album.data();
            data.id = album.id;
            arrayAlbums.push(data);
          });
          setAlbums(arrayAlbums);
        });
      // db.collection("albums")
      //   .where("artist", "==", artist.id)
      //   .get()
      //   .then(response => {
      //     const arrayAlbums = [];
      //     map(response?.docs, album => {
      //       const data = album.data();
      //       data.id = album.id;
      //       arrayAlbums.push(data);
      //     });
      //     setAlbums(arrayAlbums);
      //   });
    }
  }, [artist]);

  useEffect(() => {
    const arraySongs = [];
    (async () => {
      await Promise.all(
        map(albums, async album => {
          const docRef = collection(getDb(), "songs");
      const q = query(docRef,where("album", "==", album.id));
     await getDocs(q).then(response => {
            map(response?.docs, song => {
              const data = song.data();
              data.id = song.id;
             
              arraySongs.push(data);
            });
          });
          // await db
          //   .collection("songs")
          //   .where("album", "==", album.id)
          //   .get()
          //   .then(response => {
          //     map(response?.docs, song => {
          //       const data = song.data();
          //       data.id = song.id;
          //       arraySongs.push(data);
          //     });
          //   });
        })
      );
      setSongs(arraySongs);
    })();
  }, [albums]);

  return (
    <div className="artist">
      {artist && <BannerArtist artist={artist} />}
      <div className="artist__content">
        <BasicSliderItems
          title="Álbumes"
          data={albums}
          folderImage="album"
          urlName="album"
        />
        <SongsSlider title="Canciónes" data={songs} playerSong={playerSong} />
      </div>
    </div>
  );
}
export default withRouter(Artist);
