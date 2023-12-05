import { defineStore } from "pinia";

interface rootState {
  isLoading: boolean;
}

const useStore = defineStore("root", {
  state: (): rootState => {
    return {
      isLoading: false,
    };
  },
  actions: {
    start() {
      this.isLoading = true;
    },

    finish() {
      this.isLoading = false;
    },
  },
});

export default useStore;
