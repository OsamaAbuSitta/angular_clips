import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection,QuerySnapshot } from "@angular/fire/compat/firestore";
import IClip from '../models/clip';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  public clipsCollection : AngularFirestoreCollection<IClip>;

  constructor(
    private db : AngularFirestore, 
    private auth:AuthService) 
    {
    this.clipsCollection = db.collection('clips');
   }

   createClip(data:IClip){
     return this.clipsCollection.add(data);
   }

    async getUserClips(filter:any){
    debugger;
      const query = this.clipsCollection.ref.where(
        'uid','==', this.auth.currentUser?.uid
      );

     const result : QuerySnapshot<IClip> =  await query.get();
     return result.docs;
   }

}
