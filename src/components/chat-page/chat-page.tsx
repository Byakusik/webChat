import '@ionic/core';
import {Component, Prop, State} from '@stencil/core';
import firebase from 'firebase';

@Component({
  tag: 'chat-page'
})
export class ChatPage {

  messageListElement = null;
  messageInputElement = null;

  @State() textMessage: string  = '';
  @State() user:        any     = null;

  @Prop() MESSAGE_TEMPLATE :string=
    '<div class="message-container col-11 offset-1 right">' +
    '<div class="spacing">' +
    '<div class="pic"></div>' +
    '</div>' +
    '<div class="message-container-header">' +
    '<div class="name"></div> ' +
    '<div class="timestamp"></div> ' +
    '</div>' +
    '<div class="message"></div>' +
    '</div>';

  displayMessage(key, name, text, timestamp) {
    let div = document.getElementById(key);

    if (!div) {
      let container = document.createElement('div');
      container.innerHTML = this.MESSAGE_TEMPLATE;
      div = container.querySelector('.message-container');

      if (this.user.displayName == name) {
        div.classList.remove('right', 'offset-1');
      }

      div.setAttribute('id', key);

      this.messageListElement.appendChild(div);
    }

    div.querySelector('.name').textContent = name;
    let messageElement = div.querySelector('.message');

    if (text) {
      messageElement.textContent = text;
      messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
    }

    let timestampElement = div.querySelector('.timestamp');

    if (timestamp) {
      timestampElement.textContent = '('+timestamp+')';
    }

    setTimeout(function() {div.classList.add('visible')}, 1);

    this.messageListElement.scrollTop = this.messageListElement.scrollHeight;
    this.messageInputElement.focus();
  }

   loadMessages() {
    let limit = 50;

    let callback = function(snap) {
      var data = snap.val();
      this.displayMessage(snap.key, data.name, data.text, data.timestamp);
    };

    firebase.database().ref('/messages/').limitToLast(limit).on('child_added', callback.bind(this));
    firebase.database().ref('/messages/').limitToLast(limit).on('child_changed', callback.bind(this));
  }

  getCurrentDate() {
    let date = new Date();

    let options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timezone: 'UTC',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    };

    return date.toLocaleString("ru", options)
  }

  sendMessageHandler(e) {
    e.preventDefault();
    if (this.textMessage) {
      let currentdate = this.getCurrentDate();
      let message = this.textMessage;
      this.textMessage = '';
      return firebase.database().ref('/messages/').push({
        name: this.user.displayName,
        text: message,
        timestamp: currentdate
      });
    }
  }

  handleChange(event) {
    this.textMessage = event.target.value;
  }

  logOut() {
    firebase.auth().signOut();
    window.location.reload();
  }

  componentWillLoad() {
    firebase.auth().onAuthStateChanged( (user) => {
      if(user) {
        this.user = user;
      }
    });
  }

  componentDidLoad () {
    this.messageListElement   = document.getElementById('chatArea');
    this.messageInputElement  = document.getElementById('messageInput');
    this.loadMessages();
  }

  render() {
    return (
      <div>
        <div class="chat-form">
          <div id="chatArea" class="chat-area"></div>
          <form onSubmit={(e) => this.sendMessageHandler(e)} class="message-area">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text name">
                    <username-button username={this.user.displayName}>
                      <div class="username-dropdown-menu">
                        <div class="menu-item" onClick={() => this.logOut()}>Выйти</div>
                      </div>
                    </username-button>
                </span>
              </div>
              <input type="text" onInput={(event) => this.handleChange(event)} id="messageInput" class="form-control"
                     placeholder="Ваше сообщение..." value={this.textMessage} aria-label="message"/>
                <div class="input-group-append">
                  <button id="sendBtn" class="btn btn-outline-secondary" type="submit">Send</button>
                </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
