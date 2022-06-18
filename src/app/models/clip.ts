import firebase from 'firebase/compat/app';

export default interface IClip {
  id?: string;
  uid:string;
  displayName:string;
  title:string;
  fileName:string;
  url:string;
  clipPath:string;
  timestamp:firebase.firestore.FieldValue;
}