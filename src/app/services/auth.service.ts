import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from '@angular/fire/auth';
import firebase from 'firebase/compat/app';

import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

import { BehaviorSubject } from 'rxjs';
import { UserAuth } from '../common/interfaces/auth.interface';
import { AppModule } from '../app.module';

@Injectable({
  providedIn: AppModule,
})
export class AuthService {
  public _uid: BehaviorSubject<any> = new BehaviorSubject(null);
  currentUser: any;

  constructor(private afAuth: Auth, private afs: AngularFirestore) {}

  async register(email: string, password: string): Promise<User> {
    try {
      const { user } = await createUserWithEmailAndPassword(
        this.afAuth,
        email,
        password
      );
      await signInWithEmailAndPassword(this.afAuth, email, password);
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const { user } = await signInWithEmailAndPassword(
        this.afAuth,
        email,
        password
      );

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async loginWithGoogle(): Promise<User> {
    try {
      const { user } = await signInWithPopup(
        this.afAuth,
        new firebase.auth.GoogleAuthProvider()
      );
      // this.updateUserData(user);
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async logout() {
    try {
      await signOut(this.afAuth);
      console.log('Logout');
    } catch (error) {
      throw new Error(error.message);
    }
  }

  getId() {
    const auth = getAuth();
    this.currentUser = auth.currentUser;
    return this.currentUser?.uid;
  }

  setUserData(uid) {
    this._uid.next(uid);
  }

  async resetPassword(email: string): Promise<any> {
    try {
      return sendPasswordResetEmail(this.afAuth, email);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sendEmailVerification(user: User): Promise<void> {
    try {
      return await sendEmailVerification(user);
    } catch (error) {
      console.log('Error -->', error);
    }
  }

  isEmailVerified(user: User) {
    return user.emailVerified === true ? true : false;
  }

  private updateUserData(user: UserAuth) {
    const userRef: AngularFirestoreDocument<UserAuth> = this.afs
      .collection('users')
      .doc(user.uid);
    // console.log('userRef -->', userRef)
    const data: UserAuth = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
    };
    return userRef.set(data, { merge: true });
  }
}
