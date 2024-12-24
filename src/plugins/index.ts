import { type App } from 'vue';
import { loadElementPlus } from './elementPlus';
import { loadvView } from './vViewer';
import { loadDirective } from './directive';

export function loadPlugins(app: App) {
  loadElementPlus(app);
  loadvView(app);
  loadDirective(app);
}
