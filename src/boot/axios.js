import axios from 'axios';
import {LocalStorage} from "quasar";
// "async" is optional
export default async ({Vue}) => {

  var token =LocalStorage.getItem('token');
  Vue.prototype.$axios = axios.create({
    // baseURL: "http://localhost:8000",
    baseURL: 'http://cdiagsmod.gerware.tech',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${token}`
    }
  })
}
