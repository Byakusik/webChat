import '@ionic/core';
import {Component, Event, EventEmitter, Prop, Watch, State} from '@stencil/core';
import firebase from 'firebase';

@Component({
  tag: 'auth-comp'
})


export class AuthComp {
  @Prop() googleAuth: boolean = false;

  @Watch('googleAuth')
  watchHandler(newValue: boolean) {
    if (newValue) {
      this.googleLogin();
    }
  }

  @Event() authEmit: EventEmitter;

  @State() isAuth: boolean = false;

  authHandler() {
    this.authEmit.emit();
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(result => {
      if (result.user){
        this.authHandler();
      }
    });
  }
}
