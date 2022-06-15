import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { Observable, from, filter, of } from "rxjs";
import { concatMap, catchError, map, take, mergeMap, delay, switchMap } from "rxjs/operators";
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import IUser from "../models/user-model";


@Injectable({ providedIn: 'root' })
export class AuthService {
    private userCollection: AngularFirestoreCollection<IUser>;
    public isAuthenticated$: Observable<boolean>;
    public isAuthenticatedWithDelay$: Observable<boolean>;
    private redirect = false;

    constructor(
        private auth: AngularFireAuth,
        private db: AngularFirestore,
        private route: ActivatedRoute,
        private router: Router) {
        this.userCollection = this.db.collection<IUser>('users')
        this.isAuthenticated$ = auth.user.pipe(map(result => !!result));
        this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(event => this.route.firstChild),
            switchMap(route => route?.data ?? of({}))
        ).subscribe(data => {
            this.redirect = data.authOnly ?? false;
        });
    }

    createUser(user: IUser, password: string): Observable<IUser> {
        const authObservable = from<any>(this.auth.createUserWithEmailAndPassword(user.email, password));
        const resultObservable = authObservable.pipe(
            catchError((error) => {
                console.log(error);
                throw error;
            }),
            take(1),
            concatMap((userCred: any) => {
                if (userCred == null)
                    throw Error("User credentials conn't be null !!💀");

                const resultObservable = from<any>(this.userCollection.doc(userCred.user.uid).set(user)).pipe(
                    mergeMap(() => { return from(userCred.user.updateProfile({ 'displayName': user.name })) })
                );

                return resultObservable
            })
        ).pipe(
            map(result => {
                return user;
            }),
            take(1)
        )

        return resultObservable;
    }

    async login(email: string, password: string) {
        await this.auth.signInWithEmailAndPassword(email, password);
    }

    async logout() {
        await this.auth.signOut();

        if (this.redirect)
            await this.router.navigateByUrl('/'); //absulate path to base path
    }
}