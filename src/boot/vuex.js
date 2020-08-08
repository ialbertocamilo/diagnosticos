import store from '../store'

export default async (/*{ app, router, Vue }*/) => {

  Vue.prototype.$store = store;
}
