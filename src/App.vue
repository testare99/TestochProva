<script>
import { vModelText } from 'vue';

const baseUrl = 'http://localhost:8080/digg/users'
const adminUrl = 'http://localhost:8080/admin'

export default {
  data() {
    return {
      felmeddelande: [],
      felmeddelandedelete: [],
      name: '',
      address: '',
      phone: '',
      email: '',
      updateId: '',
      deleteId: '',
      page: 0,
      users: null
    }
  },
  async created() {
    this.fetchUsers()
  },

  methods: {
    clearFields() {
      this.name = ''
      this.address = ''
      this.phone = ''
      this.email = ''
      this.updateId = ''
      this.deleteId = ''
    },
    async create() {
      if(this.name.trim() !== '') {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.name,
            phone: this.phone,
            address: this.address,
            email: this.email
          })
        }
        await fetch(baseUrl, requestOptions)
        this.clearFields()
        this.fetchUsers()
      } else {
        console.log("Missing required field(s)")
        this.felmeddelande.push("Missing name");
      }
    },
    async next() {
      this.page++
      this.fetchUsers()
    },
    async prev() {
      if(this.page === 0) return
        this.page--
        this.fetchUsers()
    },
    async update() {
      if (this.updateId.trim() !== '') {
        const requestOptions = {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.name ? this.name : null,
            phone: this.phone ? this.phone : null,
            address: this.address ? this.address : null,
            email: this.email ? this.email : null
          })
        }
        await fetch(baseUrl +'/' + this.updateId, requestOptions)
        this.clearFields()
        this.fetchUsers()
      }
    },
    async del() {
      if(this.deleteId.trim() !== '') {
        const requestOptions = {
          method: 'DELETE'
        }
        await fetch(baseUrl +'/' + this.deleteId, requestOptions)
        this.clearFields()
        this.fetchUsers()
      } else {
        console.log("Missing required field(s)")
        this.felmeddelandedelete.push("Missing Id");
      }
    },
    async load() {
      const requestOptions = {
          method: 'POST'
        }
        await fetch(adminUrl +'/users:load', requestOptions)
        this.fetchUsers()
        
    },
    async reset() {
      const requestOptions = {
          method: 'DELETE'
        }
        await fetch(adminUrl +'/users', requestOptions)
        this.users = null
    },
    async fetchUsers() {
      this.users = await (await fetch(baseUrl + '?page=' + this.page)).json()
    }
  }
}
</script>

<template>
  
  <div>
  <p id="felmeddelande" v-if="felmeddelande.length">
    <ul>
      <li v-for="meddelande in felmeddelande">{{ meddelande }}</li>
    </ul>
  </p>
  <label>Name * <input v-model="name"></label>
  <label>Address <input v-model="address"></label>
  <label>Phone <input v-model="phone"></label>
  <label>Email <input v-model="email"></label>
  <label>Id (for update) <input v-model="updateId"></label>
  <button @click="create">Create</button>
  <button @click="update">Update</button>
  <p>* required field(s)</p>
  </div>

  <p id="felmeddelandedelete" v-if="felmeddelandedelete.length">
        <ul>
      <li v-for="meddelande in felmeddelandedelete">{{ meddelande }}</li>
    </ul>
  </p>
  <div id="deleteid">
    <label>Id <input v-model="deleteId"></label>
    <button @click="del">Delete</button>
  </div>
  
  <div id="tabell">
    <p class="tabellrad" v-for="user in users">{{ user }}</p>
    <button @click="prev">Prev</button>
    <button @click="next">Next</button>
  </div>

  <div>
    <p>Management</p>
    <button @click="load">Load users</button>
    <button @click="reset">Reset users</button>
  </div>
  <div>
    <button>Svenska</button>
    <button>English</button>
  </div>



</template>

<style>
* {
  font-size: inherit;
}

textarea {
  display:block;
  margin-bottom: 10px;
  width: fit-content;
}

div {
  margin-left: 30px;
  margin-top: 30px;
}

input {
  display: block;
  margin-bottom: 10px;
}

.buttons {
  clear: both;
}

button + button {
  margin-left: 5px;
  margin-bottom: 10px;
}
</style>