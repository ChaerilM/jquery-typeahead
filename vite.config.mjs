import { defineConfig } from 'vite';
import autoprefixer from 'autoprefixer';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const version = pkg.version;
const date = new Date();
const yyyy = date.getFullYear().toString();
const mm = (date.getMonth() + 1).toString().padStart(2, '0');
const dd = date.getDate().toString().padStart(2, '0');
const yyyymmdd = `${yyyy}-${mm}-${dd}`;
const bannerText = `/*!
 * jQuery Typeahead
 * Copyright (C) ${yyyy} RunningCoder.org
 * Licensed under the MIT license
 *
 * @author ${pkg.author.name}
 * @version ${version} (${yyyymmdd})
 * @link https://github.com/ChaerilM/jquery-typeahead
 */
`;

export default defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "./src/variables.scss";`
            }
        },
        postcss: {
            plugins: [autoprefixer()]
        }
    },
    build: {
        rollupOptions: {
            input: './src/jquery.typeahead.js',
            output: {
                dir: './dist',
                entryFileNames: 'jquery.typeahead.min.js',
                format: 'iife',
                banner: bannerText,
            }
        }
    }
});
