import { createApp } from 'vue';
import { setupStore } from '@/store';
import { setupRouter, router } from '@/router';
import { setupRouterGuard } from '@/router/guard';
import { loadPlugins } from '@/plugins';
import App from './App.vue';

// 样式
import 'viewerjs/dist/viewer.css';
import 'element-plus/dist/index.css';
import 'remixicon/fonts/remixicon.css';
import '@/styles/index.scss';
import 'tsx-element-table/dist/style.css';

function bootstrap() {
  const app = createApp(App);
  // 加载状态管理
  setupStore(app);
  // 加载路由管理
  setupRouter(app);
  // 加载插件
  loadPlugins(app);
  // 加载路由守卫
  setupRouterGuard(router);
  // 注册全局组件
  app.mount('#app');
}

bootstrap();
