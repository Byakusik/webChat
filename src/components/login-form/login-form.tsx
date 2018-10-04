import { Component, Element, Event, EventEmitter, State } from '@stencil/core';
import firebase from 'firebase';

@Component({
  tag: 'login-form'
})
export class LoginForm {
  @State() textEmail:     string = '';
  @State() textPassword:  string = '';
  @State() errorCode:     string = '';
  @State() errorMessage:  string = '';

  @Event() regFormEmit:     EventEmitter;
  @Event() googleAuthEmit:  EventEmitter;

  @Element() el: Element;

  renderRegFormHandler() {
    this.regFormEmit.emit();
  }

  googleAuthAttemptHandler() {
    this.googleAuthEmit.emit();
  }

  setError(error) {
    this.errorCode = error.code;
    this.errorMessage = error.message;
  }

  customAuthAttemptHandler(e) {
    e.preventDefault();
    this.errorCode = '';
    if (this.textEmail && this.textPassword) {
      firebase.auth().signInWithEmailAndPassword(this.textEmail, this.textPassword).catch((error) => {
        this.errorCode = error.code;
        this.errorMessage = error.message;
      });
    } else if (!this.textEmail) {
      this.errorCode = 'auth/empty-login';
    } else if (!this.textPassword) {
      this.errorCode = 'auth/empty-password';
    }
  }

  handleEmailChange(event) {
    this.textEmail = event.target.value;
  }

  handlePasswordChange(event) {
    this.textPassword = event.target.value;
  }

  getErrorTextByCode(errorCode) {
    let errorText = '';
    switch (errorCode) {
      case          'auth/invalid-email':
        errorText = 'Неверно введён e-mail!';
        break;
      case          'auth/user-disabled':
        errorText = 'Пользователь заблокирован!';
        break;
      case          'auth/user-not-found':
        errorText = 'Пользователь с таким адресом электронной почты не найден! Пожалуйста, зарегистрируйтесь.';
        break;
      case          'auth/wrong-password':
        errorText = 'Неверный пароль!';
        break;

      case          'auth/empty-login':
        errorText = 'Пустое поле "Email"!';
        break;
      case          'auth/empty-password':
        errorText = 'Пустое поле "Пароль"!';
        break;

      default:
        errorText = 'Неизвестная ошибка!';
    }

    return errorText;
  }

  render() {
    let errorBLock = '';

    if (this.errorCode) {
      let errorText = this.getErrorTextByCode(this.errorCode);

      errorBLock = '<div class="alert alert-danger" role="alert">' +
                      errorText +
                   '</div>';

      let errorArea = document.getElementById('errorArea');

      errorArea.innerHTML = errorBLock;
    }

    return (
      <div>
        <form class="offset-md-2 col-md-8" onSubmit={(e) => this.customAuthAttemptHandler(e)}>
          <div class="form-header">Авторизация</div>
          <hr/>
          <div class="form-group">
            <label htmlFor="inputEmail">E-mail</label>
            <input type="email" class="form-control" id="inputEmail" aria-describedby="emailHelp"
                   placeholder="example@gmail.com"    value={this.textEmail}        onInput={(event) => this.handleEmailChange(event)} />
          </div>
          <div class="form-group">
            <label htmlFor="inputPassword">Пароль</label>
            <input type="password" class="form-control" id="inputPassword"
                   placeholder="********"             value={this.textPassword}     onInput={(event) => this.handlePasswordChange(event)} />
          </div>
          <div id="errorArea"></div>

          <button type="submit"                                                     class="btn btn-primary"                 >Войти</button>
          <button type="button"   onClick={() => this.googleAuthAttemptHandler()}   class='btn btn-primary'                 >Войти с помощью Google</button>
          <button type="button"   onClick={() => this.renderRegFormHandler()}       class="btn btn-primary"   id='toRegBtn' >Регистрация</button>
        </form>
      </div>
    );
  }
}
