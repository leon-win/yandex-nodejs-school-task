import Vue from 'vue';
import App from './app.vue';

const appInstance = new Vue({
  el: '#app',
  render: h => h(App)
});

const appComponent = appInstance.$children[0];

window.MyForm = {
  validate: appComponent.validate,
  getData: appComponent.getData,
  setData: appComponent.setData,
  submit: appComponent.submit
};
