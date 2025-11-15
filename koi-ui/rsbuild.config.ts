import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { electronRs } from 'electron-rs';
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
