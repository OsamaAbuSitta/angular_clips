import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection,QueryDocumentSnapshot,QuerySnapshot } from "@angular/fire/compat/firestore";
import IClip from '../models/clip';
import { AuthService } from './auth.service';
import {BehaviorSubject, firstValueFrom, lastValueFrom, map, Observable, of} from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClipService implements Resolve<IClip|null> {
  public clipsCollection : AngularFirestoreCollection<IClip>;
  public pageClips: IClip[] = [];
  hasPendingRequest = false;

  constructor(
    private db : AngularFirestore, 
    private auth:AuthService,
    private storage:AngularFireStorage,
    private router : Router
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
     await this.storage.ref(`${data.screenshotPath}`).delete();
     await this.clipsCollection.doc(data.id).delete();
   }

   async getClips(){
    if(this.hasPendingRequest)
      return;

    this.hasPendingRequest = true;

     let query = this.clipsCollection.ref
                      .orderBy('timestamp','desc')
                      .limit(6);
     const { length } = this.pageClips;
     if(length)
     {
        const lastDocumentId = this.pageClips[length - 1].id; 
        const lastDoc = await firstValueFrom(this.clipsCollection.doc(lastDocumentId)
                        .get());

        query = query.startAfter(lastDoc);
     }

     const snapshot = await query.get();
     snapshot.forEach(doc=> {
        this.pageClips.push({
          id: doc.id,
          ...doc.data()
        });
     });

     this.hasPendingRequest = false;
   }


   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IClip|null> | Promise<IClip|null> | IClip|null {
    const id :string = route.params.id;

    return this.clipsCollection.doc(id)
            .get()
            .pipe(map(snapshot=> {
              const data  = (snapshot.data() as IClip);
              
              if(!data){
                this.router.navigate(['/']);
                return null;
              }

              return data;
            }));
    }

}
