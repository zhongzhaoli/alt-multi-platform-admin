import { RouteRecordRaw } from 'vue-router';
import { ElSubMenu, ElMenuItem, ElMenu } from 'element-plus';
import { h, computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useRoute } from 'vue-router';

function createIcon(icon: string) {
  return h('i', { className: 'el-icon' }, [h('i', { className: icon })]);
}
function createSubMenu(route: RouteRecordRaw, index: string) {
  return h(
    ElSubMenu,
    {
      index,
    },
    {
      title: () => {
        const titleText = (route.meta?.title || 'unknow') as string;
        const iconName = (route.meta?.icon || '') as string;
        return [createIcon(iconName), h('span', titleText)];
      },
      default: () => {
        return createList(route.children || []);
      },
    }
  );
}

function createMenuItem(route: RouteRecordRaw, index: string) {
  return h(
    ElMenuItem,
    {
      index,
    },
    {
      default: () => {
        const titleText = (route.meta?.title || 'unknow') as string;
        const iconName = (route.meta?.icon || '') as string;
        if (iconName) {
          return [createIcon(iconName), h('span', titleText)];
        } else {
          return [h('span', titleText)];
        }
      },
    }
  );
}

function createList(list: RouteRecordRaw[]) {
  const vnodeList: any[] = [];
  list.forEach((route: RouteRecordRaw) => {
    const index = route.path.toString() as string;
    if (route.meta?.hidden) return;
    if (route.children && route.children.length) {
      // if (route.children.length > 1) {
      // 如果是Root，只渲染子节点
      if (route.name !== 'Root') {
        vnodeList.push(createSubMenu(route, index));
      } else {
        vnodeList.push(createList(route.children));
      }
      // } else {
      //   if (route.meta && route.meta.alwaysShow !== true) {
      //     vnodeList.push(createMenuItem(route.children[0], index));
      //   } else {
      //     vnodeList.push(createSubMenu(route, index));
      //   }
      // }
    } else {
      vnodeList.push(createMenuItem(route, index));
    }
  });
  return vnodeList;
}

export default function createSidebar(list: RouteRecordRaw[]) {
  let vnode: any;
  const route = useRoute();
  const appStore = useAppStore();
  // 是否折叠Sidebar
  const isCollapse = computed(() => !appStore.sidebarOpened);
  if (list && list.length) {
    vnode = createList(list);
  } else {
    return {
      render() {
        return h('div', 'Error: Route list is empty!');
      },
    };
  }
  return {
    render() {
      return h(
        ElMenu,
        {
          collapse: isCollapse.value,
          defaultActive: route.path,
          collapseTransition: false,
          mode: 'vertical',
          uniqueOpened: true,
          router: true,
          style: {
            width: '100%',
          },
        },
        {
          default: () => vnode,
        }
      );
    },
  };
}
