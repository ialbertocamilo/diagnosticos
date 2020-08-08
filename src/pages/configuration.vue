<template>
  <q-page class="q-ma-md items-center justify-center ">

    <div class="row justify-center q-pa-xs-sm">
      <q-card class="q-ma-md ">
        <q-card-section class="row">
          <q-item-label class="text-h5">Colores de la barra superior</q-item-label>
        </q-card-section>
        <q-card-section class="row q-gutter-sm">

          <div class="col">
            <div class="q-gutter-md ">
              <q-input
                class="col-md col-xs-11"
                filled
                label="Fondo"
                v-model="barra_superior"
              >

                <template v-slot:append>

                  <div
                    :style="'height: 2vh;width:2vh; border:solid ; border-width: 1px;background:'+barra_superior "></div>
                  <q-icon class="cursor-pointer" name="colorize">
                    <q-popup-proxy transition-hide="scale" transition-show="scale">
                      <q-color v-model="barra_superior"/>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

            </div>
          </div>
          <div class="col">
            <div class="q-gutter-md row items-start">
              <q-input
                class="col-md col-xs-11"
                filled
                label="Letra"
                v-model="barra_superior_letra"
              >
                <template v-slot:append>
                  <div
                    :style="'height: 2vh;width:2vh; border:solid ; border-width: 1px;background:'+barra_superior_letra "></div>
                  <q-icon class="cursor-pointer" name="colorize">
                    <q-popup-proxy transition-hide="scale" transition-show="scale">
                      <q-color v-model="barra_superior_letra"/>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

          </div>

        </q-card-section>
        <br>
        <q-card-section class="row">

          <q-item-label class="text-h5">Colores de la barra izquierda</q-item-label>
        </q-card-section>

        <q-card-section class="row q-gutter-sm">
          <div class="col">
            <q-input
              class="col-md col-xs-11 "
              filled
              label="Fondo"
              style="width: 100%"
              v-model="barra_izquierda"
            >
              <template v-slot:append>

                <div
                  :style="'height: 2vh;width:2vh; border:solid ;border-width: 1px;background:'+barra_izquierda"></div>
                <q-icon class="cursor-pointer" name="colorize">
                  <q-popup-proxy transition-hide="scale" transition-show="scale">
                    <q-color v-model="barra_izquierda"/>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col">
            <q-input
              class="col-md col-xs-11"
              filled
              label="Letra"
              style="width: 100%"
              v-model="barra_izquierda_letra"
            >
              <template v-slot:append>
                <div
                  :style="'height: 2vh;width:2vh; border:solid ;border-width: 1px;background:'+barra_izquierda_letra "></div>
                <q-icon class="cursor-pointer" name="colorize">
                  <q-popup-proxy transition-hide="scale" transition-show="scale">
                    <q-color v-model="barra_izquierda_letra"/>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </q-card-section>
        <br>
        <q-card-section class="row q-gutter-md">

          <div class="col-md col-xs-11 text-center">
            <q-file accept="image/png" label="Logotipo" outlined v-model="logo_file">
              <template v-slot:prepend>
                <q-icon name="attach_file"/>
              </template>
            </q-file>
            <div v-if="logo_file">
              <img :src="imageLogo" height="150px"
                   width="180px"></img>
            </div>
            <div v-else>
              <img :src="$axios.defaults.baseURL + '/config/logo.png'" height="150px"
                   width="180px"></img>
            </div>
          </div>
          <div class="col-md col-xs-11 text-center">
            <q-file accept="image/png" label="Fondo" outlined v-model="fondo_inicio">
              <template v-slot:prepend>
                <q-icon name="attach_file"/>
              </template>
            </q-file>

            <div v-if="fondo_inicio">
              <img :src="imageFondo" height="150px"
                   width="180px">
            </div>
            <div v-else>
              <img :src="$axios.defaults.baseURL + '/config/fondo_inicio.png'" height="150px"
                   width="180px"></img></div>
          </div>


        </q-card-section>

        <q-card-section class="row q-gutter-md">
          <div class="col-md col-xs-11 text-center">
            <q-file accept="image/png" label="Firma" outlined v-model="firma">
              <template v-slot:prepend>
                <q-icon name="attach_file"/>
              </template>
            </q-file>

            <div v-if="firma">
              <img :src="firma_img" height="150px"
                   width="180px"></img>
            </div>
            <div v-else>
              <img :src="$axios.defaults.baseURL + '/config/firma.png'" height="150px"
                   width="180px"></img>
            </div>
          </div>
                    <div class="col-md col-xs-11 text-center">
                      <q-file accept="image/png" label="Cabecera PDF" outlined v-model="cabecera_pdf">
                        <template v-slot:prepend>
                          <q-icon name="attach_file"/>
                        </template>
                      </q-file>

                      <div v-if="cabecera_pdf">
                        <img :src="cabecera_pdf_img" height="150px"
                             width="180px"></img>
                      </div>
                      <div v-else>
                        <img :src="$axios.defaults.baseURL + '/config/cabecera_pdf.png'" height="150px"
                             width="180px"></img></div>
                    </div>
                    <div class="col-md col-xs-11 text-center">
                      <q-file accept="image/png" label="Footer PDF" outlined v-model="footer_pdf">
                        <template v-slot:prepend>
                          <q-icon name="attach_file"/>
                        </template>
                      </q-file>

                      <div v-if="footer_pdf">
                        <img :src="footer_pdf_img" height="150px"
                             width="180px"></img>
                      </div>
                      <div v-else>
                        <img :src="$axios.defaults.baseURL + '/config/footer_pdf.png'" height="150px"
                             width="180px"></img></div>
                    </div>
        </q-card-section>

        <q-card-section class="row q-gutter-md">
          <div class="col-md-6 col-xs-11">
            <q-input label="Información de contacto" v-model="info_contact"></q-input>
          </div>

        </q-card-section>

        <q-card-section class="row q-gutter-md">

          <div class="col">
            <q-btn @click="guardar" color="primary" label="Guardar" rounded>
            </q-btn>
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
  </q-page>
</template>

<script>

export default {
  name: 'configuration',
  data() {
    return {
      imageLogo: '',
      imageFondo: '',
      info_contact: '',
      logo_file: null,
      fondo_inicio: null,
      barra_superior: '',
      barra_superior_letra: '',
      barra_izquierda: '',
      barra_izquierda_letra: '',
      firma: null,
      cabecera_pdf: null,

      footer_pdf: null,
      firma_img: '',
      cabecera_pdf_img: '',
      footer_pdf_img: '',
      progress: false
    };
  },
  async created() {
    this.progress = true;
    var token = this.$q.localStorage.getItem('token');
    var form = new FormData();
    form.append('var', 'info_contact');
    try {
      var {data} = await this.$axios.post('/api/get-config', form);
    }catch (e){
      window.location.reload();
    }
    this.info_contact = data.value;
    this.barra_superior = this.$q.localStorage.getItem('barra_superior');
    this.barra_superior_letra = this.$q.localStorage.getItem('barra_superior_letra');
    this.barra_izquierda = this.$q.localStorage.getItem('barra_izquierda');
    this.barra_izquierda_letra = this.$q.localStorage.getItem('barra_izquierda_letra');

    this.progress = false;
  },
  watch: {

    logo_file(value) {
      if (value) {

        var uri = URL.createObjectURL(value);
        this.imageLogo = uri;
      }
    },
    fondo_inicio(value) {

      if (value) {

        var uri = URL.createObjectURL(value);
        this.imageFondo = uri
      }
    },
    firma(value) {

      if (value) {

        var uri = URL.createObjectURL(value);
        this.firma_img = uri
      }
    },
    cabecera_pdf(value) {
      if (value) {

        var uri = URL.createObjectURL(value);
        this.cabecera_pdf_img = uri
      }
    },
    footer_pdf(value) {

      if (value) {

        var uri = URL.createObjectURL(value);
        this.footer_pdf_img = uri
      }
    }
  },
  methods: {
    async guardar() {

      this.progress = true;
      await this.setVariable('info_contact', this.info_contact);
      await this.setVariable('barra_superior', this.barra_superior);
      await this.setVariable('barra_superior_letra', this.barra_superior_letra);
      await this.setVariable('barra_izquierda', this.barra_izquierda);
      await this.setVariable('barra_izquierda_letra', this.barra_izquierda_letra);

      await this.uploadFile('/api/upload-logo', this.logo_file);
      await this.uploadFile('/api/upload-fondo-inicio', this.fondo_inicio);
      await this.uploadFile('/api/upload-firma', this.firma);
      await this.uploadFile('/api/upload-cabecera-pdf', this.cabecera_pdf);
      await this.uploadFile('/api/upload-footer-pdf', this.footer_pdf);

      this.progress = false;
      window.location.reload(true);
    },
    async uploadFile(endpoint, file) {
      if (file) {
        console.log(file)
        var form = new FormData();
        form.append('file', file);
        await this.$axios.post(endpoint, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
      }
    },
    async setVariable(myvar, myval) {
      var form = new FormData();
      form.append('var', myvar);
      form.append('val', String(myval));
      await this.$axios.post('/api/set-config', form);
    }
  }
};
</script>

<style scoped>

</style>
