<template>
  <div :style="fondo_inicio" class="fullscreen" v-on:keydown.enter="buscar">

    <q-toolbar :style="barra_superior+';'+barra_superior_letra" class="row">

      <div class="col">
        <q-toolbar-title>
          <img :src="logo" width="6%"/>
          {{ nombre_app }}
        </q-toolbar-title>
      </div>
      <q-btn flat label="Iniciar sesión" name="tab1" to="/login"/>
    </q-toolbar>

    <div class="row content-center justify-center ">
      <q-card class="q-ma-lg q-pa-lg " style="width: 100%; max-width: 670px; border-radius: 15px" bordered>
        <q-card-section class="row justify-center">
          <img :src="logo" height="100px" width="270px"/>
        </q-card-section>
        <q-card-section class="row justify-center">
          <div class="col-md-7 col-xs-12">
            <q-input label="Ingrese su dni:"
                     mask="########" required
                     dense
                     rounded
                     outlined
                     v-model="dni"></q-input>
          </div>

        </q-card-section>
        <q-card-section class="row">
          <div class="col-md">
            <q-item-label class="text-grey" v-if="paciente">Paciente: {{ paciente }}</q-item-label>
          </div>
          <div class="col-sm-5  col-xs-6 q-mr-lg">

            <q-btn @click="buscar" color="blue" label="Enviar" style="width: 50%"></q-btn>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-end">
            <q-circular-progress
              class="q-ma-md"
              color="blue"
              indeterminate
              size="xs"
              v-if="progress"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>

  </div>
</template>

<script>

export default {
  name: 'paymentform',
  data() {
    return {

      dni: '',
      nombre_app: 'Consulta Radiografía',
      progress: false,
      barra_superior: '',
      barra_superior_letra: '',
      barra_izquierda: '',
      barra_izquierda_letra: '',
      fondo_inicio: '',
      paciente: '',
      logo: this.$axios.defaults.baseURL + '/config/logo.png'
    };
  },
  async created() {
    this.fondo_inicio = ` background-image: url("${this.$axios.defaults.baseURL + '/config/fondo_inicio.png'}"); background-repeat: no-repeat; background-size: cover; height: 100%`;

    const favicon = document.querySelector('[rel=icon]');
    favicon.href = this.logo;
    const {data} = await this.$axios.get('/api/get-all-config');

    data.forEach(this.guardarConfigs);
  },
  methods: {
    async buscar() {
      var form = new FormData();
      form.append('dni', this.dni);
      try {
        var data = await this.$axios.post("/api/get-diagnostics", form)
        if (data.status===200){
          this.$q.localStorage.set('dni', this.dni);
          this.$router.push('/diagnosticos');
        }else
        {
          this.$q.notify({
            message: "Datos incorrectos, intente nuevamente.",
            position:'center',
            timeout:1200,
            color:'warning'
          })
        }
      }catch (e){
        this.$q.notify({
          message: "Datos incorrectos, intente nuevamente.",
          position:'center',
          timeout:1200,
          color:'negative'
        })
      }

    },
    limpiar() {
      this.dni = '';
    },
    guardarConfigs(i, c) {
      switch (i.var) {
        case 'barra_superior': {
          this.$q.localStorage.set('barra_superior', i.value);
          this.barra_superior = 'background:' + this.$q.localStorage.getItem('barra_superior');
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
          this.barra_superior_letra = 'color:' + this.$q.localStorage.getItem('barra_superior_letra');
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
    },


  },

};
</script>
