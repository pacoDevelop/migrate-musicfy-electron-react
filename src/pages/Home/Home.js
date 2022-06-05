import React, { useState, useEffect } from "react";
import { map } from "lodash";
import BannerHome from "../../components/BannerHome";
import BasicSliderItems from "../../components/Sliders/BasicSliderItems";
import SongsSlider from "../../components/Sliders/SongsSlider";
import  { getDb } from "../../utils/FirebaseCustom";
// import "firebase/firestore";
import { getDocs,query, limit ,collection } from "firebase/firestore";

import "./Home.scss";

const db = getDb();

export default function Home(props) {
  const { playerSong } = props;
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const docRef = collection(db, "artists");
    getDocs(docRef).then(response => {
      const arrayArtists = [];
      map(response?.docs, artist => {
        const data = artist.data();
        data.id = artist.id;
        arrayArtists.push(data);
      });
      setArtists(arrayArtists);
    });
    // collection(db,"artists")
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

  useEffect(() => {
    const docRef = collection(db, "albums");
    getDocs(docRef).then(response => {
      const arrayAlbums = [];
      map(response?.docs, album => {
        const data = album.data();
        data.id = album.id;
        arrayAlbums.push(data);
      });
      setAlbums(arrayAlbums);
    });
    // db.collection("albums")
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
  }, []);

  useEffect(() => {
    const docRef = collection(db, "songs");
    const q = query(docRef, limit(10));
    getDocs(q).then(response => {
      const arraySongs = [];
      map(response?.docs, song => {
        const data = song.data();
        data.id = song.id;
        arraySongs.push(data);
      });
      setSongs(arraySongs);
    });
    // db.collection("songs")
    //   .limit(10)
    //   .get()
    //   .then(response => {
    //     const arraySongs = [];
    //     map(response?.docs, song => {
    //       const data = song.data();
    //       data.id = song.id;
    //       arraySongs.push(data);
    //     });
    //     setSongs(arraySongs);
    //   });
  }, []);

  return (
    <>
      <BannerHome />
      <div className="home">
        <BasicSliderItems
          title="Últimos artistas"
          data={artists}
          folderImage="artist"
          urlName="artist"
        />
        <BasicSliderItems
          title="Últimos álbumes"
          data={albums}
          folderImage="album"
          urlName="album"
        />
        <SongsSlider
          title="Ultimas canciónes"
          data={songs}
          playerSong={playerSong}
        />
      </div>
    </>
  );
}
