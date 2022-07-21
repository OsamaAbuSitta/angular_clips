import firebase from 'firebase/compat/app';

export default interface IClip {
  id?: string;
  uid:string;
  displayName:string;
  title:string;
  fileName:string;
  url:string;
  screenshotUrl:string;
  clipPath:string;
  screenshotPath:string;
  timestamp:firebase.firestore.FieldValue;
}