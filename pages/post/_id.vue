<template>
  <div class="post-container">
    <!-- Используем компонент LoadingIndicator -->
    <LoadingIndicator :loading="loading" />

    <div v-if="!loading">
      <div v-if="editMode">
        <textarea
          v-model="editPost.title"
          ref="editTitle"
          @input="adjustTextareaHeight('editTitle')"
          class="edit-title">
        </textarea>
        <textarea
          v-model="editPost.body"
          ref="editBody"
          @input="adjustTextareaHeight('editBody')"
          class="edit-body">
        </textarea>
      </div>
      <div v-else>
        <h1 class="post-title">{{ post.title }}</h1>
        <p class="post-body">{{ post.body }}</p>
      </div>
      <p class="post-user">User: {{ getUser(post.userId) }}</p>
      <div class="buttons">
        <button @click="toggleEditMode" class="btn edit-btn">{{ editMode ? 'Cancel' : 'Edit' }}</button>
        <button v-if="editMode" @click="savePost" class="btn save-btn">Save</button>
      </div>
    </div>

    <!-- Оставляем блок loading-indicator здесь, чтобы он был поверх всех элементов -->
    <div v-if="loading" class="loading-indicator">Loading...</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editMode: false,
      editPost: {
        title: '',
        body: '',
      },
      loading: false,
    };
  },
  computed: {
    post() {
      return this.$store.state.post;
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
    toggleEditMode() {
      this.editMode = !this.editMode;
      if (this.editMode) {
        this.editPost = { ...this.post };
        this.$nextTick(() => {
          this.adjustTextareaHeight('editTitle');
          this.adjustTextareaHeight('editBody');
        });
      }
    },
    async savePost() {
      this.loading = true;
      const updatedPost = {
        ...this.post,
        title: this.editPost.title,
        body: this.editPost.body,
      };
      try {
        await this.$store.dispatch('updatePost', updatedPost);
        this.editMode = false;
      } finally {
        this.loading = false;
      }
    },
    adjustTextareaHeight(refName) {
      const textarea = this.$refs[refName];
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    },
  },
  watch: {
    post(newPost) {
      if (!this.editMode) {
        this.editPost = { ...newPost };
      }
    },
    '$route.params.id': {
      immediate: true,
      async handler() {
        this.loading = true;
        await this.$store.dispatch('fetchPost', this.$route.params.id);
        this.editPost = { ...this.post };
        this.loading = false;
      },
    },
  },
  async created() {
    this.loading = true;
    try {
      await this.$store.dispatch('fetchUsers');
      await this.$store.dispatch('fetchPost', this.$route.params.id);
      this.editPost = { ...this.post };
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.post-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.edit-title,
.edit-body {
  width: 100%;
  box-sizing: border-box;
  display: block;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  font-family: Arial, sans-serif;
  resize: none;
}

.post-title {
  font-size: 24px;
  margin-bottom: 10px;
}

.post-body {
  font-size: 16px;
  margin-bottom: 10px;
}

.post-user {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.buttons {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-btn {
  background-color: #007bff;
  color: #fff;
}

.save-btn {
  background-color: #28a745;
  color: #fff;
}

.btn:hover {
  opacity: 0.9;
}

.loading-indicator {
  position: absolute;
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
</style>
