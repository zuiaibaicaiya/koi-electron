import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver';
import Components from 'unplugin-vue-components/rspack';
import {electronRs} from "electron-rs";
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [
    pluginVue(),
    electronRs({
      ignorePack: true,
      obfuscator: {
        options: {
          rotateStringArray: true,
          stringArray: true,
          stringArrayThreshold: 0.75,
        },
      },
    }),
    pluginNodePolyfill(),
  ],
  tools: {
    rspack: (config) => {
      config.plugins?.push(
        Components({
          resolvers: [AntdvNextResolver()],
        }),
      );
      return config;
    },
  },
  output: {
    externals: {
      'electron-store': 'commonjs2 electron-store',
    },
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
});
