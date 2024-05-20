export const state = () => ({
  posts: [],
  users: [],
  post: {},
  selectedUser: null,
  start: 0,
});

export const mutations = {
  SET_POSTS(state, { userId, posts }) {
    if (userId) {
      state.posts = posts;
    } else {
      state.posts = posts;
    }
  },
  SET_SELECTED_USER(state, userId) {
    state.selectedUser = userId;
  },
  SET_USERS(state, users) {
    state.users = users;
  },
  SET_POST(state, post) {
    state.post = post;
  },
  UPDATE_POST(state, updatedPost) {
    const index = state.posts.findIndex(post => post.id === updatedPost.id);
    if (index !== -1) {
      state.posts.splice(index, 1, updatedPost);
    }
    if (state.post.id === updatedPost.id) {
      state.post = updatedPost;
    }
  },
  SET_START(state, start) {
    state.start = start;
  },
};

export const actions = {
  async setSelectedUser({ commit }, userId) {
    commit("SET_SELECTED_USER", userId);
  },
  async setStart({ commit }, start) {
    commit("SET_START", start);
  },
  async fetchPosts({ commit }, { limit = 20, start = 0, userId = null } = {}) {
    try {
      const url = userId
        ? `/posts?_limit=${limit}&_start=${start}&userId=${userId}`
        : `/posts?_limit=${limit}&_start=${start}`;
      const { data } = await this.$axios.get(url);
      commit('SET_POSTS', { userId, posts: data });
    } catch (error) {
      console.error('Ошибка при загрузке постов:', error);
    }
  },
  async fetchUsers({ commit }) {
    try {
      const { data } = await this.$axios.get('/users');
      commit('SET_USERS', data);
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
    }
  },
  async fetchPost({ commit }, postId) {
    try {
      const { data } = await this.$axios.get(`/posts/${postId}`);
      commit('SET_POST', data);
    } catch (error) {
      console.error('Ошибка при загрузке поста:', error);
    }
  },
  async updatePost({ commit }, post) {
    try {
      const { data } = await this.$axios.patch(`/posts/${post.id}`, post);
      commit('UPDATE_POST', data);
    } catch (error) {
      console.error('Ошибка при обновлении поста:', error);
      throw error;
    }
  }

};
