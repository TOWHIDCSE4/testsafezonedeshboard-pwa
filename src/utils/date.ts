export const days = [
  { value: 'monday', label: 'Mo' },
  { value: 'tuesday', label: 'Tu' },
  { value: 'wednesday', label: 'We' },
  { value: 'thursday', label: 'Th' },
  { value: 'friday', label: 'Fr' },
  { value: 'saturday', label: 'Sa' },
  { value: 'sunday', label: 'Su' },
];

export const timeFormat = (value: any) => {
  if (!value) return '0s';

  const hours = Math.floor(value / 3600);
  let minutes: any = Math.floor((value - hours * 3600) / 60);
  const seconds = Math.floor(value - hours * 3600 - minutes * 60);
  let time = '';

  if (hours != 0) {
    time = hours + 'h ';
  }
  if (minutes != 0 || time !== '') {
    minutes = minutes < 10 && time !== '' ? '0' + minutes : String(minutes);
    time += minutes + 'm ';
  }
  if (time === '') {
    time = seconds + 's';
  } else {
    time += seconds < 10 ? '0' + seconds + 's' : String(seconds) + 's';
  }
  return time;
};
