import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection,QueryDocumentSnapshot,QuerySnapshot } from "@angular/fire/compat/firestore";
import IClip from '../models/clip';
import { AuthService } from './auth.service';
import {BehaviorSubject, of} from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  public clipsCollection : AngularFirestoreCollection<IClip>;

  constructor(
    private db : AngularFirestore, 
    private auth:AuthService,
    private storage:AngularFireStorage
    ) 
    {
    this.clipsCollection = db.collection('clips');
   }

   createClip(data:IClip){
     return this.clipsCollection.add(data);
   }

    async getUserClips( sort : string ) {
        const query = this.clipsCollection.ref
        .where('uid','==', this.auth.currentUser?.uid)
        .orderBy('timestamp', sort === '1' ? 'desc' : 'asc');
  
       const result : QuerySnapshot<IClip> =  await query.get();
       return result.docs;
   }

   updateClip(data:IClip){
     return of(this.clipsCollection.doc(data.id).set(data));
   }

   async deleteClip(data:IClip){
     await this.storage.ref(`${data.clipPath}`).delete();
     await this.clipsCollection.doc(data.id).delete();
   }

}
