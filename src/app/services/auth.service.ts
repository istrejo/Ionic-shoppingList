import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCredential,
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
import { Platform } from '@ionic/angular';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Injectable({
  providedIn: AppModule,
})
export class AuthService {
  platform = inject(Platform);
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
      let message = '';
      console.log(
        '🚀 ~ file: auth.service.ts:57 ~ AuthService ~ login ~ error',
        error.message
      );
      if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
        message = 'Email already in use';
      } else {
        message = 'Network Error';
      }

      throw new Error(message);
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
      let message = '';
      console.log(
        '🚀 ~ file: auth.service.ts:57 ~ AuthService ~ login ~ error',
        error.message
      );
      if (error.message === 'Firebase: Error (auth/user-not-found).') {
        message = 'User Not Found';
      } else if (error.message === 'Firebase: Error (auth/wrong-password).') {
        message = 'Wrong Password';
      } else {
        message = 'Network Error';
      }

      throw new Error(message);
    }
  }

  // Usin Angular fire method
  // async loginWithGoogle(): Promise<User> {
  //   try {
  //     const { user } = await signInWithPopup(
  //       this.afAuth,
  //       new GoogleAuthProvider()
  //     );
  //     // this.updateUserData(user);
  //     return user;
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }

  // Capacitor google auth plugin

  async loginWithGoogle(): Promise<any> {
    try {
      let googleUser = await GoogleAuth.signIn();
      const credential = GoogleAuthProvider.credential(
        googleUser.authentication.idToken
      );
      console.log('🚀 ~ credential', credential);
      return signInWithCredential(this.afAuth, credential);
    } catch (error) {}
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
    return user.emailVerified === true;
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
