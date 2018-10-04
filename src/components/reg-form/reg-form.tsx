import {Component, Event, EventEmitter, Prop, State} from '@stencil/core';
import firebase from 'firebase';

@Component({
  tag: 'reg-form'
})
export class RegForm {
  @Prop() appName: string;

  @Event() loginFormEmit: EventEmitter;

  @State() textEmail:     string = '';
  @State() textName:      string = '';
  @State() textPassword:  string = '';
  @State() errorCode:     string = '';
  @State() errorMessage:  string = '';

  handleEmailChange(event) {
    this.textEmail      = event.target.value;
  }

  handleNameChange(event) {
    this.textName       = event.target.value;
  }

  handlePasswordChange(event) {
    this.textPassword   = event.target.value;
  }

  renderLoginFormHandler() {
    this.loginFormEmit.emit();
  }

  regAttemptHandler(e) {
    e.preventDefault();

    this.errorCode = '';

    if (this.textEmail && this.textPassword && this.textName) {
      firebase.auth().createUserWithEmailAndPassword(this.textEmail, this.textPassword).catch((error) => {
        this.errorCode = error.code;
        this.errorMessage = error.message;
      }).then(() => {
        let user = firebase.auth().currentUser;

        user.updateProfile({
          displayName: this.textName,
          photoURL: ''
        })
      });
    } else if (!this.textEmail) {
      this.errorCode = 'auth/empty-login';
    } else if (!this.textName) {
      this.errorCode = 'auth/empty-name';
    } else if (!this.textPassword) {
      this.errorCode = 'auth/empty-password';
    }
  }

  componentWillLoad() {
    console.log('Component regForm to be rendered');
  }

  getErrorTextByCode(errorCode) {
    let errorText = '';

    switch (errorCode) {
      case          'auth/invalid-email':
        errorText = 'Неверно введён e-mail!';
        break;
      case          'auth/email-already-in-use':
        errorText = 'Данный email занят!';
        break;
      case          'auth/weak-password':
        errorText = 'Слишком простой пароль!';
        break;

      case          'auth/empty-login':
        errorText = 'Пустое поле "Email"!';
        break;
      case          'auth/empty-password':
        errorText = 'Пустое поле "Пароль"!';
        break;
      case          'auth/empty-name':
        errorText = 'Пустое поле "Имя"!';
        break;

      default:
        errorText = 'Неизвестная ошибка!';
    }

    return errorText;
  }

  render() {
    let errorBLock = '';
    if(this.errorCode) {
      let errorText = this.getErrorTextByCode(this.errorCode);

      errorBLock =  '<div class="alert alert-danger" role="alert">' +
                        errorText +
                    '</div>';

      let errorArea = document.getElementById('regErrorArea');

      errorArea.innerHTML = errorBLock;
    }

    return (
      <div>
        <form class="offset-md-2 col-md-8" onSubmit={(e) => this.regAttemptHandler(e)}>
          <div class="form-header">Регистрация</div>
          <hr/>
          <div class="form-group">
            <label htmlFor="inputRegEmail">Email</label>
            <input type="email" class="form-control" id="inputRegEmail" aria-describedby="emailHelp"
                   placeholder="example@gmail.com"    value={this.textEmail}      onInput={(event) => this.handleEmailChange(event)} />
          </div>
          <div class="form-group">
            <label htmlFor="inputRegName">Имя (Ник)</label>
            <input type="text" class="form-control" id="inputRegName"
                   placeholder=""                     value={this.textName}       onInput={(event) => this.handleNameChange(event)} />
          </div>
          <div class="form-group">
            <label htmlFor="inputRegPassword">Password</label>
            <input type="password" class="form-control" id="inputRegPassword"
                   placeholder="********"             value={this.textPassword}   onInput={(event) => this.handlePasswordChange(event)} />
          </div>
          <div id="regErrorArea"></div>

          <button type="submit"                                                   class="btn btn-primary"                     >Регистрация</button>
          <button type="button"   onClick={() => this.renderLoginFormHandler()}   class="btn btn-primary"   id="loginFormBtn" >Вход</button>
        </form>
      </div>
    );
  }
}
