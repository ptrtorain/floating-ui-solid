import { defineConfig } from 'tsup';

export default defineConfig({
	dts: true, // Generate TypeScript declaration files
	minify: true, // Minify the output files
	sourcemap: false, // Do not generate sourcemaps
	treeshake: true, // Remove unused code
	splitting: true, // Enable code splitting
	clean: true, // Clean the output directory before each build
	outDir: 'dist', // Output directory
	entry: ['./src/index.ts'], // Entry point of the application
	format: ['esm', 'cjs'], // Output formats: ES modules, CommonJS, and UMD
	external: ['@floating-ui/dom'], // Exclude @floating-ui/dom from the bundle
	target: 'es2020',
});
