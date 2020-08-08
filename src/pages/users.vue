<template>
  <q-page class="q-gutter-md q-ma-md">
    <div class="row justify-center ">
      <q-card class="col-md-7 col-xs-12">
        <q-card-section class="row q-gutter-md">
          <div class="col">
            <q-btn @click="dialog=true" color="primary" label="Agregar usuario" rounded>
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

        <q-card-section>
          <q-table
            :columns="columns"
            :data="rows"
            :pagination.sync="pagination"
            bordered
            row-key="name"
            title=""
            virtual-scroll
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <!--            <q-btn dense round flat color="grey" @click="editRow(props)" icon="edit"></q-btn>-->
                <q-btn @click="deleteRow(props)" color="grey" dense flat icon="delete" round></q-btn>
              </q-td>
            </template>

          </q-table>
        </q-card-section>

      </q-card>
    </div>

    <q-dialog persistent v-model="dialog">
      <q-card @keyup.enter="guardar" style="min-width: 350px">
        <q-card-section class="">
          <q-input autofocus dense label="Nombre" outlined rounded v-model="name"/>
        </q-card-section>
        <q-card-section class="">
          <q-input autofocus dense label="Correo" outlined rounded type="email" v-model="email"/>
        </q-card-section>
        <q-card-section class="">
          <q-input autofocus dense label="Contraseña" outlined rounded type="password" v-model="password"/>
        </q-card-section>
        <q-card-section class="">
          <q-select :options="opciones" dense label="Tipo" option-label="name" option-value="id" outlined rounded
                    v-model="select_model"/>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" v-close-popup/>
          <q-btn @click="guardar" flat label="Guardar" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
  export default {
    name: 'users'
    ,
    data() {
      return {
        name: '',
        password: '',
        email: '',
        select_model: null,
        opciones: [
          { id: 0, name: 'Administrador' },
          { id: 1, name: 'Super-Administrador' }
        ],
        dialog: false,
        progress: false,
        rows: [],
        pagination: {
          rowsPerPage: 10
        },
        columns: [
          { name: 'id', align: 'left', label: 'Id', field: 'id', sortable: true },
          { name: 'name', align: 'left', label: 'Nombre', field: 'name', sortable: true },
          { name: 'email', align: 'left', label: 'Correo', field: 'email', sortable: true },
          { name: 'role', align: 'left', label: 'Rol', field: 'role', sortable: true },
          { name: 'actions', align: 'left', label: 'Acciones', field: 'actions', sortable: true }
        ]
      };
    },
    created() {
      this.obtenerUsuarios();
    },
    methods: {
      async guardar() {
        this.progress = true;
        var token = this.$q.localStorage.getItem('token');
        try {
        var form = new FormData();
        form.append('name', this.name);
        form.append('password', this.password);
        form.append('email', this.email);
        form.append('role', this.select_model.id);
          var data = await this.$axios.post('api/register', form, {
            'Authorization': `Bearer ${token}`
          });
          console.log(data);
          if (data.status != 200) {
            this.$q.dialog({
              ok: true,
              html: true,
              message: `<span class="text-red">Ocurrió un problema, comuníquese con el Administrador.</span>`,
              title: 'Mensaje',
              color: 'negative'
            });
            this.obtenerUsuarios();
            return null;
          }
        } catch (e) {
          this.$q.dialog({
            ok: true,
            html: true,
            message: `<span class="text-red">Asegúrese que los datos son correctos, reintentar.</span>`,
            title: 'Mensaje',
            color: 'negative'
          });
        }
        this.progress = false;
        this.obtenerUsuarios();
        this.limpiarDialog()


      },
      async limpiarDialog() {
        this.name = '';
        this.email = '';
        this.password = '';
        this.select_model='';
      },
      async obtenerUsuarios() {

        this.progress = true;
        var token = this.$q.localStorage.getItem('token');
        var { data } = await this.$axios.get('api/get-users', {
          // 'Authorization': `Bearer ${token}`
        });
        this.rows = data;

        this.progress = false;
      },
      async deleteRow(props) {

        this.$q.dialog({
          cancel: true,
          ok: true,

          html: true,
          message: `<span class="text-red">Esta seguro que desea borrar ${JSON.stringify(props.row.name)}</span>`,
          title: 'Mensaje',
          color: 'negative'
        }).onOk(async () => {
          var token = this.$q.localStorage.getItem('token');
          var form = new FormData();
          form.append('id', props.row.id);
          var { data } = await this.$axios.post('/api/del-user', form, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          this.obtenerUsuarios();
        }).onCancel(async () => {

          this.obtenerUsuarios();
        });
      }

    }
  };
</script>

<style scoped>

</style>
