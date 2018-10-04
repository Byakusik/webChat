import '@ionic/core';
import { Component, Prop, Element, State, Listen } from '@stencil/core';
import firebase from 'firebase';
import {firebaseConfig} from "../../helpers/config";

@Component({
  tag: 'chat-app',
  styleUrl: 'chat-app.scss'
})

export class ChatApp {
  @Element() modalEl: HTMLElement;

  @Prop() title: string;
  // @Prop() content: string;

  @State() reg        = false;
  @State() login      = true;
  @State() googleAuth = false;
  @State() isAuth     = false;

  @Listen('regFormEmit')
  renderRegFormHandler() {
    this.reg    = true;
    this.login  = false;
  }

  @Listen('loginFormEmit')
  renderLoginFormHandler() {
    this.reg    = false;
    this.login  = true;
  }

  @Listen('googleAuthEmit')
  googleAuthAttemptHandler() {
    this.googleAuth = true;
  }

  @Listen('authEmit')
  authHandler() {
    this.isAuth = true;
  }

  componentWillLoad() {
    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged( (user) => {
      if(user) {
        this.isAuth = true;
      }
    });
  }

  render() {
    let loginForm = null;
    let regForm = null;
    let chatPage = null;

    if (this.isAuth) {
      chatPage = [
        <chat-page></chat-page>
      ];
    } else {
      if (this.reg) {
        regForm = [
          <reg-form></reg-form>
        ];
      } else if (this.login) {
        loginForm = [
          <login-form></login-form>
        ];
      }
    }

    return (
      <div>
        <auth-comp googleAuth={this.googleAuth}></auth-comp>

        {loginForm}
        {regForm}
        {chatPage}
      </div>

    )
  }
}
