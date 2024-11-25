import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import HighchartsVue from 'highcharts-vue';
import router from './router';

const app = createApp(App);

app.use(HighchartsVue);
app.use(router);
app.mount('#app');
