<template>
  <q-page class="q-ma-md items-center justify-center ">

    <div class="row justify-center q-pa-xs-sm">

      <q-card class="col-md-6 col-xs">
        <q-item-section>
          <q-form
            class="q-pa-lg row "
          >
            <div class="col col-md-5 col-xs-8">

              <q-file accept=".xlsx,.xls" label="Adjuntar excel" outlined required rounded v-model="excel">
                <template v-slot:prepend>
                  <q-icon name="attach_file"/>
                </template>
              </q-file>
            </div>
            <div class="col col-xs-3 text-center" style="margin-top: 1.0vh">
              <q-btn @click="upload" color="green" label="Subir" rounded type="submit"/>
            </div>

            <div class="col-md-1 col-xs-1 text-center" style="margin-top: 1.1vh">
              <a title="Descargar modelo excel" class="q-btn text-primary"   :href="this.$axios.defaults.baseURL+'/storage/modelo_excel.xlsx'">
                <img height="30px" src="~assets/excel.png" width="32px">
                </a>
            </div>
            <div class="col col-xs-3 text-center" style="margin-top: 1.2vh">
              <q-circular-progress
                class="q-ma-md"
                color="blue"
                indeterminate
                size="xs"
                v-if="progress"
              />
            </div>
          </q-form>
        </q-item-section>

        <q-table
          :columns="columns"
          :data="rows"
          :pagination.sync="pagination"
          bordered
          class="items-center col-md-6 col-xs-12"
          hide-bottom
          row-key="name"
          title="Lista de personas"
          virtual-scroll
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <!--            <q-btn dense round flat color="grey" @click="editRow(props)" icon="edit"></q-btn>-->
              <q-btn @click="deleteRow(props)" color="grey" dense flat icon="delete" round></q-btn>
            </q-td>
          </template>
        </q-table>
        <q-card-section>

          <div class="q-pa-lg flex flex-center no-wrap">
            <q-btn @click="goToPage(1)" flat>
              primero
            </q-btn>
            <q-btn @click="goToPage(prevPage)" flat>
              <q-icon name=" keyboard_arrow_left">
              </q-icon>
            </q-btn>
            {{page}}
            <q-btn @click="goToPage(nextPage)" flat>
              <q-icon name=" keyboard_arrow_right">
              </q-icon>
            </q-btn>
            <q-btn @click="goToPage(totalPages)" flat>
              ultimo
            </q-btn>
          </div>

        </q-card-section>
      </q-card>
    </div>

  </q-page>
</template>

<script>

  export default {
    data() {
      return {
        page: 1,
        totalPages: 0,
        prevPage: 0,
        nextPage: 0,


        progress: false,
        nombre: '',
        excel: null,

        columns: [
          { name: 'id', align: 'left', label: 'Id', field: 'id', sortable: true },
          { name: 'dni', align: 'left', label: 'Dni', field: 'dni', sortable: true },
          { name: 'nombre', align: 'left', label: 'Nombre', field: 'nombre', sortable: true },
          { name: 'actions', label: 'Acciones', field: '', align: 'center' }

        ],
        rows: [],
        pagination: {
          rowsPerPage: 10
        }
      };
    },
    async created() {

      await this.getPersonas();

    },
    methods: {
      async getPersonas() {
        this.progress = true;
        var token = this.$q.localStorage.getItem('token');
        var mydata = this.$axios.get('api/personas',
          {
            headers: {

              'Authorization': `Bearer ${token}`
            }
          }).then((e) => {
          return e;
        });

        var { data } = await mydata;
        this.rows = data.data;

        this.page = data.current_page;

        this.nextPage = Number(data.next_page_url ? data.next_page_url.slice(-1) : 1);
        this.prevPage = Number(data.prev_page_url ? data.prev_page_url.slice(-1) : 1);
        this.totalPages = Number(data.last_page_url ? data.last_page_url.slice(-1) : 1);

        this.progress = false;
        return data;
      },

      async upload() {

        this.progress = true;
        var form = new FormData();

        form.append('excel', this.excel);
        try {

          var token = this.$q.localStorage.getItem('token');
          var { data } = await this.$axios.post('/api/subir', form, {
            headers: {
              'Content-Type': 'application/vnd.ms-excel',
              'Authorization': `Bearer ${token}`
            }
          });
          if (data) {
            this.$q.dialog({
              ok: true,
              message: 'Archivo subido con éxito',
              title: 'Mensaje',
              color: 'secondary'
            });
          } else {
            this.$q.dialog({
              ok: true,
              html: true,
              message: '<span class="text-red">Error al subir el archivo</span>',
              title: 'Mensaje',
              color: 'negative'
            });
          }
        } catch (exception) {
          this.$q.dialog({
            ok: true,
            html: true,
            message: '<span class="text-red">Error al subir el archivo</span>',
            title: 'Mensaje',
            color: 'negative'
          });
        }
        this.getPersonas();

        this.progress = false;
      },
      async deleteRow(props) {

        this.$q.dialog({
          cancel: true,
          ok: true,

          html: true,
          message: `<span class="text-red">Esta seguro que desea borrar ${JSON.stringify(props.row.nombre)}</span>`,
          title: 'Mensaje',
          color: 'negative'
        }).onOk(async () => {
          var token = this.$q.localStorage.getItem('token');
          var form = new FormData();
          form.append('persona_id', props.row.id);
          var { data } = await this.$axios.post('/api/delete-person', form, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          await this.getPersonas();
        }).onCancel(() => {

        });
      },
      async goToPage(page) {
        this.page = page;
        this.loading = true;
        var token = this.$q.localStorage.getItem('token');
        var { data } = await this.$axios.get('api/personas?page=' + page, null, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
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
      async descargarModelo(){

      }
    }
  };
</script>

<style scoped>

</style>
