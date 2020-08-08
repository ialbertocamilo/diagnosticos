<template>
  <div>

    <form>
      <div class="row content-center justify-center ">
        <q-card class="q-ma-lg q-pa-lg " style="width: 100%; max-width: 550px">
          <q-card-section class="row q-ma-none q-pa-none q-gutter-sm">
            <div class="col-xs col-md-4 ">
              <q-input @keyup="" label="DNI"
                       mask="########" required
                       v-model="dni"></q-input>
            </div>
            <br>
            <div class="col-xs col-md-7">
              <q-input @keyup="" label="Nombre"
                       required
                       v-model="nombre"></q-input>
            </div>
            <div class="col-xs col-md-7">
              <q-input @keyup="" label="Descripcion"
                       required
                       v-model="descripcion"></q-input>
            </div>
          </q-card-section>
          <br/>
          <q-card-section class="row q-ma-none q-pa-none">
            <div class="col col-md col-xs-12 ">
              <q-file @change="imgUpload()" accept=".jpg, image/*" label="Radiografía" outlined required
                      v-model="voucher">
                <template v-slot:prepend>
                  <q-icon name="attach_file"/>
                </template>
              </q-file>
              <img :src="img" height="300px"
                   onerror="this.src='https://revistaimagen.com/wp-content/plugins/accelerated-mobile-pages/images/SD-default-image.png'"
                   ref="voucherImage"
                   width="100%"/>
            </div>

          </q-card-section>
          <q-separator></q-separator>
          <q-card-section>
            <div class="row justify-center">
              <q-btn @click="guardar" color="primary" label="Guardar" style="width: 50%"></q-btn>

            </div>
            <div class="row justify-center">
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


    </form>
  </div>
</template>

<script>
export default {
  name: 'cargarRadios',
  data() {
    return {
      descripcion: '',
      editor: '',
      nombre_app: 'Radiografias',
      dni: '',
      monto: '',
      nombreread: false,
      nombre: '',
      diagnostico: '',
      op_fecha: null,
      op_numero: '',
      info_contact: '',
      op_banco: '',
      voucher: null,
      img: null,
      barra_superior_letra: '',
      barra_superior: '',
      progress: false,
      logo: this.$axios.defaults.baseURL + '/config/logo.png'
    };
  },
  watch: {
    voucher: function (value) {
      this.img = URL.createObjectURL(value);
    },
    dni: async function (value) {
      if (value.length >= 8) {

        var token = this.$q.localStorage.getItem('token');

        var form = new FormData()
        form.append('dni', value)
        var {data} = await this.$axios.post("api/find-by-dni", form, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        if (data) {
          this.nombre = data;

        }
      }
    }
  },
  async created() {

    const favicon = document.querySelector('[rel=icon]');
    favicon.href = this.logo;
    const {data} = await this.$axios.get('/api/get-all-config');

    data.forEach(this.guardarConfigs);
  },
  methods: {
    async guardar() {
      var form = new FormData()
      form.append('dni', this.dni)
      form.append('nombre', this.nombre)
      form.append('radiografia', this.voucher)
      form.append('descripcion', this.descripcion)
      form.append('diagnostico', this.diagnostico)
      var token = this.$q.localStorage.getItem('token');
      var {data} = await this.$axios.post('api/save-radio', form, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (data == "ok") {
        alert("Se ha guardado");
        this.limpiar()
      }
    },
    limpiar() {
      this.dni = '';
      this.nombre = '';
      this.diagnostico = '';
      this.voucher = null;
      this.descripcion = '';
      this.nombreread = false;
      this.img = 'https://revistaimagen.com/wp-content/plugins/accelerated-mobile-pages/images/SD-default-image.png'
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
    }
  },

  imgUpload(e) {

    console.log('gaa');
    var file = new FileReader();
    file.onload = function (e) {
      this.$refs.voucherImage.src = this.voucher;
    };
    // var uri=URL.createObjectURL(blob);
    // console.log(uri);
    // this.img="https://png.pngtree.com/thumb_back/fw800/back_pic/03/95/21/6357ec6ce346d1b.jpg"
    //
    // this.img=uri;
    // // this.$refs.voucherImage.src="https://png.pngtree.com/thumb_back/fw800/back_pic/03/95/21/6357ec6ce346d1b.jpg";
    // this.$refs.voucherImage2.src= this.img;
  }
};
</script>

<style scoped>
.q-drawer {
  /*background-image: url(https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-2.32103624.jpg) !important;*/
  background-image: url('/statics/images/lake.jpg') !important;
  background-size: cover !important;
}

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
