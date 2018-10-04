import { Component, Event, EventEmitter, Prop, State } from '@stencil/core';

@Component({
  tag: 'username-button'
})
export class UsernameButton {
  @Prop() username: string = '';
  @State() toggle: boolean = false;
  @Event() onUsernameClicked: EventEmitter;

  toggleClick() {
    this.toggle = !this.toggle;

    if (this.toggle) {
      document.getElementById('dropdownBtn').classList.add('opened');
    } else {
      document.getElementById('dropdownBtn').classList.remove('opened');
    }

    this.onUsernameClicked.emit({ visible: this.toggle });
  }

  render() {
    return (
      <div>
        <div onClick={() => this.toggleClick()} class="dropdown-toggle" id="dropdownBtn">
          {this.username}
        </div>
        <div style={{ display: this.toggle ? 'block' : 'none' }}>
          <slot></slot>
        </div>
      </div>
    )
  }
}
