<template>
  <div :style="fondo_inicio" class="fullscreen" v-on:keydown.enter="buscar">

    <q-toolbar :style="barra_superior+';'+barra_superior_letra" class="row">

      <div class="col">
        <q-toolbar-title @click="$router.push('/')">
          <img :src="logo" width="6%"/>
          {{ nombre_app }}
        </q-toolbar-title>
      </div>
      <q-btn flat label="Iniciar sesión" name="tab1" to="/login"/>
    </q-toolbar>

    <div class="row  justify-center ">
      <q-card class="q-ma-lg  " style="width: 100%; max-width: 750px; border-radius:22px">
        <div class="row justify-end">
          <img :src="logo" height="100px" width="270px"/>
        </div>

        <q-card-section class="row">
          <div class="col col-md col-xs-12 ">
            <div class="justify-start">
              <div v-if="progress">

                <q-circular-progress
                  class="q-ma-md"
                  color="blue"
                  indeterminate
                  size="xs"
                />
                Espere..
              </div>
            </div>
            <q-table
              :columns="columns"
              :data="rows"
              :pagination.sync="pagination"
              bordered
              hide-bottom
              row-key="name"
              title=""
              virtual-scroll
              flat
              dense
            >
              <template v-slot:body-cell-acciones="props">
                <q-td :props="props">
                <q-btn @click="downloadRadio(props)" color="grey" dense flat>
                  <i class="far fa-arrow-alt-circle-down text-blue"></i>
                  Radiografía
                </q-btn>
              </q-td>
                <q-td :props="props">
                  <q-btn @click="downloadDiag(props)" color="grey" dense flat>
                    <i class="far fa-arrow-alt-circle-down text-blue"></i>
                    Informe
                  </q-btn>
                </q-td>
              </template>

            </q-table>
            <div class=" ">

              <div class="q-pa-lg flex flex-center no-wrap">
                <q-btn @click="goToPage(1)" flat>
                  primero
                </q-btn>
                <q-btn @click="goToPage(prevPage)" flat>
                  <q-icon name=" keyboard_arrow_left">
                  </q-icon>
                </q-btn>
                {{ page }}
                <q-btn @click="goToPage(nextPage)" flat>
                  <q-icon name=" keyboard_arrow_right">
                  </q-icon>
                </q-btn>
                <q-btn @click="goToPage(totalPages)" flat>
                  ultimo
                </q-btn>
              </div>
            </div>
          </div>

        </q-card-section>
      </q-card>
    </div>

  </div>
</template>

<script>
import {exportFile} from "quasar";

export default {
  name: 'ListDiag',
  async created() {
    this.fondo_inicio = ` background-image: url("${this.$axios.defaults.baseURL + '/config/fondo_inicio.png'}"); background-repeat: no-repeat; background-size: cover; height: 100%`;

    const favicon = document.querySelector('[rel=icon]');
    favicon.href = this.logo;
    let {data} = await this.$axios.get('/api/get-all-config');
    data.forEach(this.guardarConfigs);


    var dni = this.$q.localStorage.getItem('dni');
    this.progress = true;
    var form = new FormData();
    form.append('dni', dni);
    data = await this.$axios.post("/api/get-diagnostics", form)

    console.log(data.data)
    this.page=data.data.current_page
    this.rows = data.data.data;
    if (data.statusCode == 200) {
      this.paciente = data.data[0].paciente
    }
    this.progress = false;
  },

  computed: {
    myDni: {
      get() {
        return this.dni;
      },
      set(value) {
        this.dni = value
      }
    }
  },
  data() {
    return {
      pagination: {
        rowsPerPage: 10
      },

      nombre_app: 'Consulta Radiografía',
      page: 1,
      totalPages: 0,
      prevPage: 0,
      nextPage: null,
      rows: [],
      columns: [
        {name: 'descripcion', align: 'left', label: 'Descripción', field: 'descripcion', sortable: true},
        {name: 'creado', align: 'left', label: 'Fecha de Radiografía', field: 'creado', sortable: true},
        {name: 'acciones', align: 'left', label: 'Acciones', field: 'acciones', sortable: true},
      ],
      progress: false,
      barra_superior: '',
      barra_superior_letra: '',
      barra_izquierda: '',
      barra_izquierda_letra: '',
      fondo_inicio: '',
      paciente: '',
      logo: this.$axios.defaults.baseURL + '/config/logo.png'
    }
  },
  methods: {
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
    downloadRadio(prop) {
      // console.log(prop.row)
      window.open(this.$axios.defaults.baseURL + "/" + prop.row.archivo)

    },
    async downloadDiag(prop) {
      this.progress=true;
      var data = await this.$axios.get("/api/download-diag?id=" + prop.row.id, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'blob'
      });

      exportFile('diagnostico.pdf', data.data, 'application/pdf')
      this.progress=false;
    },
    async goToPage(page) {
      this.page = page;
      this.loading = true;
      var dni = this.$q.localStorage.getItem('dni');
      var form = new FormData();
      form.append('dni', dni);
      var {data} = await this.$axios.post('api/get-diagnostics?page=' + page, form);
      this.page = data.current_page;
      // this.totalPages=Number(data.last_page_url.slice(-1));
      console.log(data);
      this.loading = false;
      this.nextPage = Number(data.next_page_url ? data.next_page_url.slice(-1) : 1);
      this.prevPage = Number(data.prev_page_url ? data.prev_page_url.slice(-1) : 1);
      this.totalPages = Number(data.last_page_url ? data.last_page_url.slice(-1) : 1);
      this.rows = data.data;
    },
  }
}
</script>
