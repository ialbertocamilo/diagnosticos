<template>
  <q-page class="q-gutter-md q-ma-md">
    <div class="row justify-center ">
      <q-card class="col-md-3 col-xs-12">
        <q-card-section class="row q-gutter-md">
          <div class="col-md col-xs-11">
            <q-input label="Contraseña" type="password" v-model="password"
                     v-on:keyup.enter="$refs.pass.focus()"></q-input>
            <q-input @keyup.enter="guardar" label="Repetir contraseña" ref="pass" type="password"
                     v-model="password_r"></q-input>
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
    name: 'change_password',
    data() {
      return {
        password: '',
        password_r: '',
        progress: false,
        equal: false
      };
    },
    watch: {
      password_r(value) {
        if (value != this.password) {
          console.log('no es igual');
          this.equal = false;
        } else {
          console.log('es igual');
          this.equal = true;
        }
      }
    },
    methods: {
      async guardar() {
        if (this.equal) {
          var form = new FormData();
          form.append('password', this.password);
          var token = this.$q.localStorage.getItem('token');
          var data = await this.$axios.post('/api/change-password', form, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (data.status == 200) {
            this.$q.dialog({
              ok: true,
              message: 'Contraseña cambiada con éxito',
              title: 'Mensaje',
              color: 'secondary'
            });
            return true;
          }
        }
        this.$q.dialog({
          ok: true,
          message: 'Contraseñas no son iguales',
          title: 'Mensaje',
          color: 'secondary'
        });

      }
    }
  };
</script>

<style scoped>

</style>
