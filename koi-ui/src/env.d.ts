/// <reference types="@rsbuild/core/types" />
import 'pinia';
import { Router } from 'vue-router';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    $router: Router;
  }
}
declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  // biome-ignore lint/complexity/noBannedTypes: reason
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
