import React, { useState, useCallback } from "react";
import { Image } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import NoAvatar from "../../assets/png/user.png";
import  firebase from "../../utils/FirebaseCustom";
import { getAuth,updateProfile } from "firebase/auth";
import "firebase/storage";
import "firebase/auth";
import { getStorage, ref,getDownloadURL,uploadBytes  } from "firebase/storage";

export default function UploadAvatar(props) {
  const { user, setReloadApp } = props;
  const [avatarUrl, setAvatarUrl] = useState(user.photoURL);

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    setAvatarUrl(URL.createObjectURL(file));
    uploadImage(file).then(() => {
      updateUserAvatar();
    });
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    onDrop
  });

  const uploadImage = async file => {
    const storage = getStorage();
    const storageRef = ref(storage,`avatar/${user.uid}`);
    // const ref = firebase
    //   .storage()
    //   .ref()
    //   .child(`avatar/${user.uid}`);
    await uploadBytes(storageRef, file).then((v) => {
      console.log('Fichero subido!');
      return true;
    });
    // return ref2.put(file);
    return false;
  };

  const updateUserAvatar = () => {
   

   const storage = getStorage();
   getDownloadURL(ref(storage, `avatar/${user.uid}`)).then(async response => {
     updateProfile(getAuth().currentUser,{ photoURL: response })
    .then( setReloadApp(prevState => !prevState)).catch(() => {
      toast.error("Error al actualizar el avatar.");
    })})
       
    // firebase
    //   .storage()
    //   .ref(`avatar/${user.uid}`)
    //   .getDownloadURL()
    //   .then(async response => {
    //     await updateProfile(getAuth().currentUser,{ photoURL: response });
    //     setReloadApp(prevState => !prevState);
    //   })
    //   .catch(() => {
    //     toast.error("Error al actualizar el avatar.");
    //   });
  };

  return (
    <div className="user-avatar" {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <Image src={NoAvatar} />
      ) : (
        <Image src={avatarUrl ? avatarUrl : NoAvatar} />
      )}
    </div>
  );
}
