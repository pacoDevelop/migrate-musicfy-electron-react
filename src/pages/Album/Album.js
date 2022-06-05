import React, { useState, useEffect } from "react";
import { Loader } from "semantic-ui-react";
import { withRouter } from "../../utils/withRouter";
import { map } from "lodash";
import ListSongs from "../../components/Songs/ListSongs";
import firebase,{ getDb } from "../../utils/FirebaseCustom";
import "firebase/firestore";
import "firebase/storage";
import { getDocs,getDoc,collection,query,where,doc } from "firebase/firestore";
import "./Album.scss";
import { getStorage, ref,getDownloadURL } from "firebase/storage";
import { useParams   } from "react-router-dom";

const db = getDb();

function Album(props) {
  const { match, playerSong } = props;
  const [album, setAlbum] = useState(null);
  const [albumImg, setAlbumImg] = useState(null);
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const { id } = useParams(); 

  useEffect(() => {
 const docRef = doc(getDb(), "albums",id);
    
    getDoc(docRef).then(response => {
        
        // doc.data() is never undefined for query doc snapshots
        const data = response.data();
        data.id = response.id;
        // console.log(data.id)
        if(data.id){
          setAlbum(data);
        }
        
       
      });
    // db.collection("albums")
    //   .doc(match.params.id)
    //   .get()
    //   .then(response => {
    //     const data = response.data();
    //     data.id = response.id;
    //     setAlbum(data);
    //   });
  }, [match]);

  useEffect(() => {
    if (album) {
      const storage = getStorage();
  getDownloadURL(ref(storage,`album/${album?.banner}`)).then(url => {
      setAlbumImg(url);
      });
      // firebase
      //   .storage()
      //   .ref(`album/${album?.banner}`)
      //   .getDownloadURL()
      //   .then(url => {
      //     setAlbumImg(url);
      //   });
    }
  }, [album]);

  useEffect(() => {
    if (album) {
 const docRef = doc(getDb(), "artists",album?.artist);
    getDoc(docRef).then(response =>  {
          setArtist(response.data());
        });
      // db.collection("artists")
      //   .doc(album?.artist)
      //   .get()
      //   .then(response => {
      //     setArtist(response.data());
      //   });
    }
  }, [album]);

  useEffect(() => {
    if (album) {
      const docRef = collection(getDb(), "songs");
      const q = query(docRef,where("album", "==", album.id));
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
      //   .where("album", "==", album.id)
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
    }
  }, [album]);

  if (!album || !artist) {
    return <Loader active>Cargando...</Loader>;
  }

  return (
    <div className="album">
      <div className="album__header">
        <HeaderAlbum album={album} albumImg={albumImg} artist={artist} />
      </div>
      <div className="album__songs">
        <ListSongs songs={songs} albumImg={albumImg} playerSong={playerSong} />
      </div>
    </div>
  );
}

export default withRouter(Album);

function HeaderAlbum(props) {
  const { album, albumImg, artist } = props;

  return (
    <>
      <div
        className="image"
        style={{ backgroundImage: `url('${albumImg}')` }}
      />
      <div className="info">
        <h1>{album.name}</h1>
        <p>
          De <span>{artist.name}</span>
        </p>
      </div>
    </>
  );
}
