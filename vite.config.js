import MillionLint from '@million/lint';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
const _plugins = [react()];

_plugins.unshift(MillionLint.vite())

export default defineConfig({
  plugins: _plugins,
  base: "https://xipeRafa.github.io/realControlDBCustomers"
})