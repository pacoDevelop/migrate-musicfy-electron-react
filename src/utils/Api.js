import {getDb} from "./FirebaseCustom";
// import * as firebase from "firebase";
import firebase from 'firebase/compat/app';
import { doc, getDoc } from "firebase/firestore";
// import 'firebase/compat/firestore';
import { getAuth,EmailAuthProvider, reauthenticateWithCredential  } from "firebase/auth";

export async function isUserAdmin(uid) {
  const docRef = doc(getDb(), "admins", uid);
  
  const response = await getDoc(docRef);

  
  // const response = await 
  //   collection(getDb(),"admins")
  //   .doc(uid)
  //   .get();
  return response.exists();
}

export const reauthenticate = password => {
  const user =getAuth().currentUser;
  // console.log(firebase,user.email,
  //   password)
  const credentials = EmailAuthProvider.credential(
    user.email,
    password
  );
  

  return  reauthenticateWithCredential(
    user, 
    credentials);
}; 
