<template>
  <ul>
    <li v-for="post in posts" :key="post.id">
      <nuxt-link :to="`/post/${post.id}`">
        <h3>{{ post.title }}</h3>
      </nuxt-link>
      <p>{{ getUser(post.userId) }}</p>
      <p>{{ post.body }}</p>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    posts: {
      type: Array,
      getUser: Function,
      required: true,
    },
    getUser: {
      type: Function,
      required: true,
    },
  },
}
</script>
