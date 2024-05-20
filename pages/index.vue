<template>
  <div class="posts-container">
    <div class="controls">
      <button @click="loadPrevious" :disabled="start === 0" class="btn load-btn">Load Previous</button>
      <button @click="loadMore" :disabled="endOfPosts" class="btn load-btn">Load More</button>
      <select v-model="selectedUser" @change="filterPostsByUser" class="user-select">
        <option value="">All Users</option>
        <option v-for="user in users" :key="user.id" :value="user.id">
          {{ user.name }}
        </option>
      </select>
    </div>
    <div v-if="loading" class="loading-indicator">Loading...</div>
    <PostList v-else :posts="posts" :getUser="getUser" />
  </div>
</template>

<script>
import PostList from "@/components/PostList.vue";

export default {
  components: {
    PostList,
  },
  data() {
    return {
      selectedUser: this.$store.state.selectedUser || "",
      start: this.$store.state.start || 0,
      limit: 20,
      loading: false,
      endOfPosts: false,
    };
  },
  computed: {
    posts() {
      return this.$store.state.posts;
    },
    users() {
      return this.$store.state.users;
    },
  },
  methods: {
    getUser(userId) {
      const user = this.users.find((user) => user.id === userId);
      return user ? user.name : "Unknown User";
    },
    async filterPostsByUser() {
      this.loading = true;
      this.start = 0;
      await this.$store.dispatch("setStart", this.start);
      await this.$store.dispatch("setSelectedUser", this.selectedUser);
      await this.fetchPosts();
      this.loading = false;
    },
    async loadMore() {
      this.start += this.limit;
      this.loading = true;
      await this.$store.dispatch("setStart", this.start);
      await this.fetchPosts();
      this.loading = false;
    },
    async loadPrevious() {
      if (this.start >= this.limit) {
        this.start -= this.limit;
        this.loading = true;
        await this.$store.dispatch("setStart", this.start);
        await this.fetchPosts();
        this.loading = false;
      }
    },
    async fetchPosts() {
      await this.$store.dispatch("fetchPosts", {
        limit: this.limit,
        start: this.start,
        userId: this.selectedUser,
      });
      this.endOfPosts = this.posts.length < this.limit;
    },
  },
  async mounted() {
    this.loading = true;
    if (!this.users.length) {
      await this.$store.dispatch("fetchUsers");
    }
    await this.fetchPosts();
    this.loading = false;
  },
};
</script>

<style scoped>
.posts-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn {
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.load-btn {
  background-color: #007bff;
  color: white;
}

.load-btn:disabled {
  background-color: #d0d0d0;
  cursor: not-allowed;
}

.user-select {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  flex: 1;
}

.loading-indicator {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 20px;
  z-index: 1000;
  border-radius: 10px;
}

@media (max-width: 600px) {
  .controls {
    flex-direction: column;
  }

  .btn {
    margin-bottom: 10px;
  }
}
</style>
