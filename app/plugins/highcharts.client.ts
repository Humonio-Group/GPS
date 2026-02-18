import "highcharts";
import "highcharts/highcharts-more";
import "highcharts/modules/solid-gauge";
import HighchartsVue from "highcharts-vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(HighchartsVue);
});
