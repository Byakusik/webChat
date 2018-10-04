import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

// https://stenciljs.com/docs/config

export const config: Config = {
  bundles: [
    { components: ['chat-app', 'auth-comp', 'login-form', 'reg-form', 'chat-page', 'username-button'] },
  ],  globalStyle: 'src/global/app.css',
  plugins: [
    sass()
  ]
};
