import VueViewer from 'v-viewer';
import { App } from 'vue';

export function loadvView(app: App<Element>) {
  app.use(VueViewer);
}
