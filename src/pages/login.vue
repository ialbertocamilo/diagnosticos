<template>
  <q-layout>
    <q-page-container :style="fondo_inicio">
      <q-page @keypress.enter="login">
        <q-card class="absolute-center" style="width: 350px ;">
          <div class="row justify-center">
              <img  class=""
                     :src="$axios.defaults.baseURL+'/config/logo.png'"
                     >
          </div>

          <q-card-section>

            <div class="row    ">
              <div class="col text-h6 ellipsis  content-center">
                Iniciar sesión
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form
              class="q-gutter-md"
            >
              <q-input
                label="Usuario"
                lazy-rules
                v-model="email"
              />

              <q-input
                label="Password"
                lazy-rules
                type="password"
                v-model="password"

              />

              <div class="content-end justify-center text-center items-center">
                <q-btn @click="login" class="full-width" color="primary" label="Iniciar sesión" stretch type="button"/>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script type="text/javascript">
</script>
<script>


  export default {
    data() {
      return {
        email: '',
        password: '',
        fondo_inicio: ''
      };
    },
    created() {
      this.$q.localStorage.clear();
    },
    mounted() {


      this.fondo_inicio = ` background-image: url("${this.$axios.defaults.baseURL + '/config/fondo_inicio.png'}"); background-repeat: no-repeat; background-size: cover; height: 100%`;
    },
    methods: {
      login: async function() {

        //TODO: cambiar de email por username
        let { data } = await this.$axios.post('/api/login', {
          'name': this.email,
          'password': this.password
        });
        if (data.code === 204) {

          this.$q.localStorage.set('token', data.token);
          this.$q.localStorage.set('user', data.user);

          console.log(data.user.role);
          if (data.user.role == 1) {
            console.log("es super administrador");
            this.$q.localStorage.set('isAdmin', false);
          }
          else if (data.user.role == 0) {
            console.log("es administrador");
            this.$q.localStorage.set('isAdmin',true);
          }

          this.$router.push('dashboard');
        } else {

          this.$q.dialog({
            ok: true,
            message: 'No se pudo iniciar sesión, intente nuevamente',
            title: 'Error',
            color: 'secondary'
          });
        }

      }
    }
  };
</script>

<style>


  .mycard {
    position: center;
    max-width: 300px;
  }
</style>
