<template>
  <q-layout view="lHh LpR lFf">
    <q-header :style="estilo" reveal>
      <q-toolbar>
        <q-btn @click="left = !left" class="q-mr-sm" dense flat icon="menu" round/>
          <img :src="logo" width="12%"></img>
        <q-toolbar-title>{{ nombre_app }}

        </q-toolbar-title>

        <q-btn @click="logout" dense flat icon="fas fa-sign-out-alt" label="SALIR" to="/"/>
      </q-toolbar>
    </q-header>


    <q-drawer :content-style="barra_izquierda"
              :style="barra_izquierda_letra"
              class="left-navigation"
              elevated
              show-if-above
              side="left"
              v-model="left"
    >
      <div style="height: calc(100% - 117px)" >
        <q-toolbar>
          <q-toolbar-title>{{ nombre }}</q-toolbar-title>
        </q-toolbar>
        <hr/>
        <q-scroll-area style="height:100%;">
          <q-list padding>

            <q-item active-class="bg-grey-13" class="q-ma-sm navigation-item" clickable exact to="/dashboard" v-ripple>
              <q-item-section avatar>
                <q-icon name="dashboard"/>
              </q-item-section>

              <q-item-section>
                Lista de resultados

              </q-item-section>
            </q-item>
            <q-item active-class="bg-grey-13" class="q-ma-sm navigation-item" clickable exact to="/adjuntarResultados"
                    v-ripple>
              <q-item-section avatar>
                <q-icon name="assignment"/>
              </q-item-section>

              <q-item-section>
                Adjuntar resultado

              </q-item-section>
            </q-item>


            <q-item active-class="bg-grey-13" class="q-ma-sm navigation-item " clickable to="/personas" v-ripple>
              <q-item-section avatar>
                <q-icon name="attach_file"/>
              </q-item-section>

              <q-item-section class="items-start">
                Adjuntar personas
              </q-item-section>
            </q-item>

            <div :hidden="ocultar">
              <q-item active-class="bg-grey-13"
                      class="q-ma-sm navigation-item"
                      clickable exact to="/configuration"
                      v-ripple>
                <q-item-section avatar>
                  <q-icon name="build"/>
                </q-item-section>

                <q-item-section>
                  Configuración
                </q-item-section>
              </q-item>
              <q-item active-class="bg-grey-13"
                      class="q-ma-sm navigation-item"
                      clickable exact to="/change-password"
                      v-ripple>
                <q-item-section avatar>
                  <q-icon name="vpn_key"/>
                </q-item-section>

                <q-item-section>
                  Cambiar clave
                </q-item-section>
              </q-item>
              <q-item active-class="bg-grey-13"
                      class="q-ma-sm navigation-item"
                      clickable exact to="/users"
                      v-ripple>
                <q-item-section avatar>
                  <q-icon name="face"/>
                </q-item-section>

                <q-item-section>
                  Usuarios
                </q-item-section>
              </q-item>


            </div>
          </q-list>

        </q-scroll-area>
      </div>
    </q-drawer>
    <q-footer bordered class="absolute-bottom" elevated
              style="background: linear-gradient(145deg, rgb(74, 94, 137) 15%, rgb(30, 75, 131) 70%)">
      <div class="row  q-ma-xs items-center " style="margin-top:1.1vh">
        <div class="col-8">

          Gerware V.1
        </div>
        <div class="col-md-4 ">
          {{ info_contact }}
        </div>

      </div>
    </q-footer>
    <q-page-container>
      <q-page class="row no-wrap">
        <div class="col">
          <div class="full-height">
            <q-scroll-area class="col q-pr-sm full-height" visible>
              <router-view/>
            </q-scroll-area>
          </div>
        </div>
      </q-page>
    </q-page-container>


  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      left: false,
      nombre: this.$q.localStorage.getItem('user').name,
      nombre_app: '',
      info_contact: '',
      barra_superior: '',
      estilo: '',
      barra_izquierda: '',
      barra_izquierda_letra: '',
      logo: this.$axios.defaults.baseURL + '/config/logo.png'
    };

  },
  async created() {

    const favicon = document.querySelector('[rel=icon]');
    favicon.href = this.$axios.defaults.baseURL + '/config/logo.png';
    console.log(favicon.href)
    var token = this.$q.localStorage.getItem('token');
    var form = new FormData();
    const {data} = await this.$axios.get('/api/get-all-config', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    data.forEach(this.guardarConfigs);
    // this.info_contact=data.value;
  },
  computed: {
    ocultar() {
      if (this.$q.localStorage.getItem('isAdmin') == 1)
        return true;
      else return false;
    }
  },
  methods: {
    async logout() {
      this.$router.push('/');
      var token = this.$q.localStorage.getItem('token');
      await this.$axios.get('api/logout', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      this.$q.localStorage.clear();
    },


    guardarConfigs(i, c) {
      switch (i.var) {
        case 'barra_superior': {
          this.$q.localStorage.set('barra_superior', i.value);
          console.log(i.value);
          break;
        }
        case 'info_contact': {
          this.$q.localStorage.set('info_contact', i.value);
          this.info_contact = this.$q.localStorage.getItem('info_contact');
          break;
        }
        case 'logo': {
          this.$q.localStorage.set('logo', i.value);
          break;
        }
        case 'barra_superior_letra': {
          this.$q.localStorage.set('barra_superior_letra', i.value);
          break;
        }
        case 'barra_izquierda': {
          this.$q.localStorage.set('barra_izquierda', i.value);
          break;
        }
        case 'barra_izquierda_letra': {
          this.$q.localStorage.set('barra_izquierda_letra', i.value);
          break;
        }
        case 'fondo_inicio': {
          this.$q.localStorage.set('fondo_inicio', i.value);
          break;
        }

      }

      this.barra_superior = 'background:' + this.$q.localStorage.getItem('barra_superior');
      this.barra_superior_letra = 'color:' + this.$q.localStorage.getItem('barra_superior_letra');
      this.barra_izquierda = 'background:' + this.$q.localStorage.getItem('barra_izquierda');
      this.barra_izquierda_letra = 'color:' + this.$q.localStorage.getItem('barra_izquierda_letra');
      this.estilo = this.barra_superior + ';' + this.barra_superior_letra;
      this.info_contact = this.$q.localStorage.getItem('info_contact');
    }
  }

};
</script>

<style>


.q-drawer__content {
  background-color: rgba(1, 1, 1, 0.75);
}

.navigation-item {
  border-radius: 5px;
}

.tab-active {
  background-color: green;
}

body {
  background: #f1f1f1 !important;
}
</style>
