// Plugins
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Fonts from "unplugin-fonts/vite";
import Layouts from "vite-plugin-vue-layouts";
import Vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./", // Relative base URL for Electron
  plugins: [
    Vue({
      template: { transformAssetUrls },
    }),
    VueRouter(),
    Layouts(),
    Vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/settings.scss",
      },
    }),
    Components(),
    Fonts({
      google: {
        families: [
          {
            name: "Roboto",
            styles: "wght@100;300;400;500;700;900",
          },
        ],
      },
    }),
    AutoImport({
      imports: ["vue", "vue-router"],
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
    }),
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  build: {
    outDir: path.resolve(__dirname, "dist"), // Build output directory for Electron
    target: "esnext", // Electron compatibility (latest JS features)
    sourcemap: true, // Enable source maps for debugging
    minify: false, // Disable minification for better debugging in development
  },
  server: {
    port: 3000,
    fs: {
      strict: false, // Allow Electron to access files outside the public directory
    },
  },
});
