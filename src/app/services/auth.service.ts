import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { Observable , from } from "rxjs";
import { concatMap,catchError , map, take} from "rxjs/operators";
import IUser from "../models/user-model";


@Injectable({ providedIn: 'root' })
export class AuthService {
    private userCollection: AngularFirestoreCollection<IUser>;

    constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
        this.userCollection = this.db.collection<IUser>('users')
    }

    createUser(user: IUser,password:string) : Observable<IUser>{
      const authObservable = from<any>(this.auth.createUserWithEmailAndPassword(user.email, password));
      const addUserObservable = from<any>(this.userCollection.add(user));
      const resultObservable = authObservable.pipe(
          catchError((error)=>{
              console.log(error);
              throw error;
            }),
          take(1),
          concatMap((userCred)=> {return addUserObservable})
      ).pipe(
          map(result=> {
              return user;
          }),
          take(1)
      )

     return resultObservable;
    }
}