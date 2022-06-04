import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Observable , from } from "rxjs";
import { concatMap,catchError , map, take} from "rxjs/operators";

export interface IUser {
    name: string;
    email: string;
    age: string;
    phoneNumber: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    constructor(private auth: AngularFireAuth, private db: AngularFirestore) {

    }

    createUser(user: IUser,password:string) : Observable<IUser>{
      const authObservable = from<any>(this.auth.createUserWithEmailAndPassword(user.email, password));
      const addUserObservable = from<any>(this.db.collection('users').add(user));
      const resultObservable = authObservable.pipe(
          catchError((error)=>{
              debugger;
              console.log(error);
              throw error;
            }),
          take(1),
          concatMap((userCred)=> {return addUserObservable})
      ).pipe(
          map(result=> {
              debugger;
              return user;
          }),
          take(1)
      )

     return resultObservable;
    }
}