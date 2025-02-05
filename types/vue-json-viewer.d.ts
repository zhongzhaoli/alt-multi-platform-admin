declare module 'vue-json-viewer' {
  import { Component } from 'vue';
  interface VueJsonViewerProps {
    value: object | Array<any>;
    expandDepth?: number;
  }

  const VueJsonViewer: (props: VueJsonViewerProps) => Component;
  export default VueJsonViewer;
}
