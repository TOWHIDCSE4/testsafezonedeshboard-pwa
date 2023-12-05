import useStore from '@stores/root';
const { start, finish } = useStore();

const $loading = {
  start,
  finish,
};

export default $loading;
