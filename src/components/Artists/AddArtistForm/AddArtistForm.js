import React, { useState, useCallback } from "react";
import { Form, Input, Button, Image } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import  firebase,{ getDb } from "../../../utils/FirebaseCustom";
import "firebase/storage";
import "firebase/firestore";
import NoImage from "../../../assets/png/no-image.png";

import "./AddArtistForm.scss";
import { getStorage, ref,uploadBytes } from "firebase/storage";

import { collection,addDoc } from "firebase/firestore";

const db = getDb();

export default function AddArtistForm(props) {
  const { setShowModal } = props;
  const [formData, setFormData] = useState(initialValueForm());
  const [banner, setBanner] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(acceptedFile => {
    const file = acceptedFile[0];
    setFile(file);
    setBanner(URL.createObjectURL(file));
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    onDrop
  });

  const uploadImage =async fileName => {
    const storage = getStorage();
    const storageRef = ref(storage,`artist/${fileName}`);
    // const ref = firebase
    //   .storage()
    //   .ref()
    //   .child(`artist/${fileName}`);
    await uploadBytes(storageRef, file).then((v) => {
      console.log('Fichero subido!');
      return true;
    });
    // return ref2.put(file);
    return false;
  };

  const onSubmit = () => {
    if (!formData.name) {
      toast.warn("Añade el nombre del artista.");
    } else if (!file) {
      toast.warn("Añade la imagen del artista.");
    } else {
      setIsLoading(true);
      const fileName = uuidv4();
      uploadImage(fileName)
        .then(() => {
          addDoc(collection(db, "artists"), { name: formData.name, banner: fileName })
          .then(() => {
            toast.success("Artista creado correctamente.");
            resetForm();
            setIsLoading(false);
            setShowModal(false);
          })
          .catch(() => {
            toast.error("Error al crear el artista.");
            setIsLoading(false);
          });
          // db.collection("artists")
          //   .add({ name: formData.name, banner: fileName })
          //   .then(() => {
          //     toast.success("Artista creado correctamente.");
          //     resetForm();
          //     setIsLoading(false);
          //     setShowModal(false);
          //   })
          //   .catch(() => {
          //     toast.error("Error al crear el artista.");
          //     setIsLoading(false);
          //   });
        })
        .catch(() => {
          toast.error("Error al subir la imagen.");
          setIsLoading(false);
        });
    }
  };

  const resetForm = () => {
    setFormData(initialValueForm());
    setFile(null);
    setBanner(null);
  };

  return (
    <Form className="add-artist-form" onSubmit={onSubmit}>
      <Form.Field className="artist-banner">
        <div
          {...getRootProps()}
          className="banner"
          style={{ backgroundImage: `url('${banner}')` }}
        />
        <input {...getInputProps()} />
        {!banner && <Image src={NoImage} />}
      </Form.Field>
      <Form.Field className="artist-avatar">
        <div
          className="avatar"
          style={{ backgroundImage: `url('${banner ? banner : NoImage}')` }}
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder="Nombre del artista"
          onChange={e => setFormData({ name: e.target.value })}
        />
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Crear artista
      </Button>
    </Form>
  );
}

function initialValueForm() {
  return {
    name: ""
  };
}
