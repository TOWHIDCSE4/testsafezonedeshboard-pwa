<template>
  <div class="text-error-login" v-if="showError">Error!</div>
</template>

<script setup lang="ts">
import { setToken } from '@/plugins/axios';
import authApi from '@api/auth';
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const { login } = authApi();
const router = useRouter();
const showError = ref(false);
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if (
  urlParams.get('idToken') &&
  urlParams.get('accessToken') &&
  urlParams.get('redirect')
) {
  localStorage.setItem('access-token', urlParams.get('idToken') || '');
  localStorage.setItem('accessToken', urlParams.get('accessToken') || '');
  let urlRedirect = urlParams.get('redirect') || '';
  urlRedirect = urlRedirect.replace('[', '');
  urlRedirect = urlRedirect.replace(']', '');
  setToken(urlParams.get('idToken'), 'Bearer');
  router.push('/' + urlRedirect);
} else {
  showError.value = true;
}

const $q = useQuasar();
</script>

<style lang="scss" scoped>
.text-error-login {
  color: #ff0d0d;
  text-align: center;
  margin-top: 200px;
  font-size: 20px;
}
</style>
