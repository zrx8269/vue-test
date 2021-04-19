<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>
      <button v-permission="['admin', 'editor']">editor</button>
      <button v-permission="['admin']">admin</button>
    </p>
    <router-link to="/about/info">Info</router-link>
    <router-view/>
  </div>
</template>

