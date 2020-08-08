<template>
  <q-page>

    <div class="row q-mt-md justify-center">

      <div class="col-md-10 col-xs-12">
        <q-card bordered class="bg-white items-center flex-sm-center flex-xs-center flex-center" flat>
          <div class="row q-ma-md q-gutter-md flex ">

            <q-input bg-color="bg-white" class="col-sm-2 col-xs-11" color="primary" dense label="Dni" outlined rounded
                     standout v-model="dni"/>
            <q-input bg-color="bg-white" class="col-sm-4 col-xs-11" color="primary"
                     dense label="Nombre" outlined
                     rounded
                     standout v-model="nombres"/>
            <q-btn @click="buscar" class="col-sm-1 col-xs-2" color="blue" dense flat rounded
                   title="Buscar">
              <img alt="buscar" height="30px" src="~assets/search.png" width="32px">
            </q-btn>

            <q-btn @click="opciones_extra=!opciones_extra" class="col-sm-1 col-xs-2" color="blue"
                   dense flat label="búsqueda avanzada" rounded style="font-size: 11px"
                   title="Mostrar opciones"></q-btn>
            <q-btn @click="limpiar" class="col-sm-1 col-xs-2" color="blue" dense flat rounded
                   title="Limpiar busqueda"><img height="30px" src="~assets/cleaning.png" width="32px"></q-btn>

            <q-circular-progress
              class="q-ma-md"
              color="blue"
              indeterminate
              size="xs"
              v-if="progress"
            />
          </div>

          <div :hidden="opciones_extra">
            <div class="row  q-ma-md q-gutter-md ">

              <q-input bg-color="bg-white" class="col-sm-4 col-xs-11" color="primary"
                       dense label="Descripcion" outlined
                       rounded
                       standout v-model="descripcion"/>
              <div class="col-md-2 q-mt-none col-xs-11">
                <q-item-label class="text-grey q-mt-none text-center" overline>Fecha de registro:</q-item-label>
                <q-input dense mask="date" outlined rounded v-model="op_fecha_from">
                  <template v-slot:append>
                    <q-icon class="cursor-pointer" name="event">
                      <q-popup-proxy ref="qDateProxy" transition-hide="scale" transition-show="scale">
                        <q-date @input="() => $refs.qDateProxy.hide()" v-model="op_fecha_from"/>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>

              </div>

              <div class="col-md-2 q-mt-none col-xs-11">
                <q-item-label class="text-grey q-mt-none text-center" overline>hasta:</q-item-label>
                <q-input dense mask="date" outlined rounded v-model="op_fecha_to">
                  <template v-slot:append>
                    <q-icon class="cursor-pointer" name="event">
                      <q-popup-proxy ref="qDateProxy" transition-hide="scale" transition-show="scale">
                        <q-date @input="() => $refs.qDateProxy.hide()" v-model="op_fecha_to"/>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

            </div>

          </div>

          <div class="q-pa-md">
            <q-table
              :columns="columns"
              :data="rows"
              :pagination.sync="pagination"
              @row-dblclick="rowClick"
              bordered
              hide-bottom
              row-key="name"
              title=""
              virtual-scroll
            >
              <template v-slot:body-cell-archivo="props">
                <q-td :props="props">
                  <q-btn @click="downloadRadio(props)" color="grey" dense flat label="Ver"></q-btn>
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <!--            <q-btn dense round flat color="grey" @click="editRow(props)" icon="edit"></q-btn>-->
                  <q-btn @click="addDiagnostico(props)" color="grey" dense flat icon="note_add" round
                         title="diagnóstico"></q-btn>
                  <q-btn @click="deleteRow(props)" color="grey" dense flat icon="delete" round title="borrar"></q-btn>

                </q-td>
              </template>
              <template v-slot:body-cell-creado="props">
                <q-td :props="props">

                  <q-item-label>{{ new Date(props.row.creado).toLocaleDateString() }}</q-item-label>
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
        </q-card>


        <q-dialog v-model="statecard">
          <q-card class="q-gutter-md-lg">
            <q-card-section>
              <div class="row q-gutter-md">
                <q-input label="DNI" readonly v-model="card.dni"></q-input>
                <q-input label="Nombre" readonly v-model="card.nombre"></q-input>
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row q-gutter-md">
                <q-input label="Diagnostico" readonly v-model="card.diagnostico"></q-input>
                <q-input label="Fecha" readonly v-model="card.fecha"></q-input>
              </div>
            </q-card-section>
            <q-card-section class="q-pt-none">

              <img :src="this.card.ruta_voucher" style="width:100%;height:45vh"/>
            </q-card-section>

            <q-separator/>

            <q-card-actions align="right">
              <q-btn color="primary" flat label="ok" v-close-popup/>
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="modal_diagnostico">
          <q-card class="q-gutter-md-lg">

            <q-card-section>
              <q-item-label class="text-grey">Diagnóstico</q-item-label>
              <q-editor min-height="20rem" v-model="editor"/>
            </q-card-section>

            <q-separator/>

            <q-card-actions align="right">
              <q-btn @click="guardarDiagnostico" color="primary" flat label="ok"/>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>

    </div>


  </q-page>
</template>

<script>
import Vue from 'vue';
import IEcharts from 'vue-echarts-v3/src/full.js';
import Information_modal from 'pages/information_modal';

Vue.component('IEcharts', IEcharts);


export default {
  components: {Information_modal},
  data: function () {
    return {
      page: 1,
      totalPages: 0,
      prevPage: 0,
      nextPage: 0,

      rowId: 0,

      descripcion: '',
      modal_diagnostico: false,
      editor: '',

      statecard: false,
      cardimage: '',
      dni: '',
      nombres: '',
      diagnostico: '',
      op_fecha_from: null,//new Date().to
      // JSON(),
      op_fecha_to: null,//new Date().toJSON(),
      progress: false,
      opciones_extra: true,

      card: {
        dni: '',
        nombre: '',
        diagnostico: '',
        archivo: '',
        ruta_voucher: '',
        fecha: ''
      },
      columns: [
        {name: 'id', align: 'left', label: 'Id', field: 'id', sortable: true},
        {name: 'dni', align: 'left', label: 'Dni', field: 'dni', sortable: true},
        {name: 'paciente', align: 'left', label: 'Paciente', field: 'paciente', sortable: true},
        {
          name: 'diagnostico',
          required: true,
          label: 'Descripcion',
          align: 'left',
          field: 'descripcion',
          sortable: true
        },
        {
          name: 'archivo',
          align: 'left',
          label: 'Radiografía',
          field: 'archivo',
          sortable: true
        },
        {
          name: 'creado',
          align: 'left',
          label: 'Fecha registro',
          field: 'creado',
          sortable: true
        }, {name: 'actions', label: 'Acciones', field: '', align: 'center'}
      ],
      rows: [],
      pagination: {
        rowsPerPage: 10
      },
      busqueda: '',
      loading: false
    };
  },

  async mounted() {
    await this.buscar();
  },

  methods: {

    async buscar() {
      this.progress = true;
      console.log(this.op_fecha_from)
      var token = this.$q.localStorage.getItem('token');
      var {data} = await this.$axios.post('api/get-all-radio', {
        'descripcion':this.descripcion,
        'nombre':this.nombres,
        'dni':this.dni,
        'fecha_from':this.op_fecha_from,
        'fecha_to': this.op_fecha_to,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(data)
      this.page = data.current_page;
      this.nextPage = Number(data.next_page_url ? data.next_page_url.slice(-1) : 1);
      this.prevPage = Number(data.prev_page_url ? data.prev_page_url.slice(-1) : 1);
      this.totalPages = Number(data.last_page_url ? data.last_page_url.slice(-1) : 1);

      this.rows = data.data;

      this.progress = false;

    },
    SaveImage(type) {
      const linkSource = this.$refs[type].getDataURL();
      const downloadLink = document.createElement('a');
      document.body.appendChild(downloadLink);
      downloadLink.href = linkSource;
      downloadLink.target = '_self';
      downloadLink.download = type + '.png';
      downloadLink.click();
    },
    limpiar() {
      this.dni = '';
      this.nombres = "";
      this.descripcion = "";
      this.op_fecha_from = '';
      this.op_fecha_to = '';
      this.buscar();
    },
    async rowClick(e, row) {

      this.statecard = true;
      console.log(row)
      this.card.dni = row.dni;
      this.card.nombre = row.paciente;
      this.card.diagnostico = row.diagnostico;
      this.card.fecha = row.creado;
      this.card.ruta_voucher = this.$axios.defaults.baseURL + '/' + row.archivo;

    },
    async goToPage(page) {
      this.page = page;
      this.loading = true;
      var {data} = await this.$axios.post('api/get-all-radio?page=' + page, {
        'descripcion':this.descripcion,
        'nombre':this.nombres,
        'dni':this.dni,
        'fecha_from':this.op_fecha_from,
        'fecha_to': this.op_fecha_to,
      });
      this.page = data.current_page;
      // this.totalPages=Number(data.last_page_url.slice(-1));
      console.log(data);
      this.loading = false;
      this.nextPage = Number(data.next_page_url ? data.next_page_url.slice(-1) : 1);
      this.prevPage = Number(data.prev_page_url ? data.prev_page_url.slice(-1) : 1);
      this.totalPages = Number(data.last_page_url ? data.last_page_url.slice(-1) : 1);
      this.rows = data.data;
    },
    async deleteRow(props) {
      console.log(props)
      this.$q.dialog({
        cancel: true,
        ok: true,
        html: true,
        message: `<span class="text-red">Esta seguro que desea borrar ${JSON.stringify(props.row.paciente)}</span>`,
        title: 'Mensaje',
        color: 'negative'
      }).onOk(async () => {
        var token = this.$q.localStorage.getItem('token');
        var form = new FormData();
        form.append('radio_id', props.row.id);
        var {data} = await this.$axios.post('/api/delete-radio', form, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        await this.buscar();
      }).onCancel(() => {

      });

    },
    downloadRadio(prop) {
      // console.log(prop.row)
      window.open(this.$axios.defaults.baseURL + "/" + prop.row.archivo)

    },
    addDiagnostico(prop) {
      this.editor = prop.row.diagnostico
      this.modal_diagnostico = true;
      console.log(prop)
      this.rowId = prop.row.id;
    },
    async guardarDiagnostico(prop) {
      this.modal_diagnostico = false;
      var token = this.$q.localStorage.getItem('token');
      var form = new FormData();
      form.append('radio_id', this.rowId);
      form.append('diagnostico', this.editor);
      var {data} = await this.$axios.post('/api/save-diag-by-id', form, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (data == 'ok') {
        this.$q.notify({
          message: "Se ha guardado"
        })
        this.buscar()
      }
    }
  }
};
</script>

<style scoped>

</style>
