import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Button, Icon, Dropdown } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { map } from "lodash";
import { toast, ToastType } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import  firebase,{ getDb } from "../../../utils/FirebaseCustom";
import "firebase/firestore";
import "firebase/storage";

import "./AddSongForm.scss";

import { getStorage, ref,uploadBytes } from "firebase/storage";
    import { getDocs,collection, addDoc} from "firebase/firestore";
 
const db = getDb();

export default function AddSongForm(props) {
  const { setShowModal } = props;
  const [formData, setFormData] = useState(initialValueForm());
  const [albums, setAlbums] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
 const docRef = collection(getDb(), "albums");
  
    getDocs(docRef).then(response => {
        const albumsArray = [];
        map(response?.docs, album => {
          const data = album.data();
          albumsArray.push({
            key: album.id,
            value: album.id,
            text: data.name
          });
        });
        setAlbums(albumsArray);
      });
    // db.collection("albums")
    //   .get()
    //   .then(response => {
    //     const albumsArray = [];
    //     map(response?.docs, album => {
    //       const data = album.data();
    //       albumsArray.push({
    //         key: album.id,
    //         value: album.id,
    //         text: data.name
    //       });
    //     });
    //     setAlbums(albumsArray);
    //   });
  }, []);

  const onDrop = useCallback(acceptedFiels => {
    const file = acceptedFiels[0];
    setFile(file);
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".mp3",
    noKeyboard: true,
    onDrop
  });

  const uploadSong = async fileName => {
    const storage = getStorage();
    const storageRef = ref(storage,`song/${fileName}`);
    // const ref = firebase
    //   .storage()
    //   .ref()
    //   .child(`song/${fileName}`);
    await uploadBytes(storageRef, file).then((v) => {
      console.log('Fichero subido!');
      return true;
    });
    // return ref2.put(file);
    return false;
  };

  const onSubmit = () => {
    if (!formData.name || !formData.album) {
      toast.warn(
        "El nombre de la canción y el álbum al que pertence son obligatorios."
      );
    } else if (!file) {
      toast.warn("La cación es obligatoria.");
    } else {
      setIsLoading(true);
      const fileName = uuidv4();
      uploadSong(fileName)
        .then(() => {
          

 addDoc(collection(db, "songs"),{
              name: formData.name,
              album: formData.album,
              fileName: fileName
            }).then(() => {
              toast.success("Canción subida correctamente.");
              resetForm();
              setIsLoading(false);
              setShowModal(false);
            })
            .catch(() => {
              toast.error("Error al subir la canción.");
              setIsLoading(false);
            });
          // db.collection("songs")
          //   .add({
          //     name: formData.name,
          //     album: formData.album,
          //     fileName: fileName
          //   })
          //   .then(() => {
          //     toast.success("Canción subida correctamente.");
          //     resetForm();
          //     setIsLoading(false);
          //     setShowModal(false);
          //   })
          //   .catch(() => {
          //     toast.error("Error al subir la canción.");
          //     setIsLoading(false);
          //   });
        })
        .catch(() => {
          toast.error("Error al subir la canción.");
          setIsLoading(false);
        });
    }
  };

  const resetForm = () => {
    setFormData(initialValueForm());
    setFile(null);
    setAlbums([]);
  };

  return (
    <Form className="add-song-form" onSubmit={onSubmit}>
      <Form.Field>
        <Input
          placeholder="Nombre de la canción"
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />
      </Form.Field>
      <Form.Field>
        <Dropdown
          placeholder="Asigna la cación a un álbum"
          search
          selection
          lazyLoad
          options={albums}
          onChange={(e, data) =>
            setFormData({ ...formData, album: data.value })
          }
        />
      </Form.Field>
      <Form.Field>
        <div className="song-upload" {...getRootProps()}>
          <input {...getInputProps()} />
          <Icon name="cloud upload" className={file && "load"} />
          <div>
            <p>
              Arrastra tu cancíon o haz click <span>aquí</span>.
            </p>
            {file && (
              <p>
                Canción subida: <span>{file.name}</span>
              </p>
            )}
          </div>
        </div>
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Subir canción
      </Button>
    </Form>
  );
}

function initialValueForm() {
  return {
    name: "",
    album: ""
  };
}
