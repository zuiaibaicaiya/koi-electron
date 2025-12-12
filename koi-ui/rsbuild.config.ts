import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { electronRs } from 'electron-rs';
import Components from 'unplugin-vue-components/rspack';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { pluginSass } from '@rsbuild/plugin-sass';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [
    pluginVue(),
    pluginSass(),
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
          resolvers: [ElementPlusResolver()],
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
