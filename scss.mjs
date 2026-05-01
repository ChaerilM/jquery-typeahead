import fs from 'fs';
import * as sass from 'sass';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import CleanCSS from 'clean-css';
import { build as esbuild } from 'esbuild';

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

async function buildScss() {
    try {
        const result = await sass.compileAsync('./src/jquery.typeahead.scss', {
            style: 'expanded'
        });

        const prefixed = await postcss([autoprefixer]).process(result.css, { from: undefined }).css;
        fs.writeFileSync('./src/jquery.typeahead.css', prefixed);

        const minified = new CleanCSS().minify(prefixed).styles;
        fs.writeFileSync('./dist/jquery.typeahead.min.css', bannerText + '\n' + minified);
    } catch (error) {
        console.error('Error compiling SCSS:', error);
    }
}

async function buildJs() {
    try {
        const inputFile = './src/jquery.typeahead.js';
        const outputFile = './dist/jquery.typeahead.min.js';

        const content = fs.readFileSync(inputFile, 'utf8');
        const newContent = content.replace(/\/\*![\S\s]+?\*\/[\r\n]*/, '')
                                  .replace(/version: ["'].*?["']/, `version: '${version}'`);

        fs.writeFileSync(inputFile, newContent);

        await esbuild({
            entryPoints: [inputFile],
            outfile: outputFile,
            minify: true,
            bundle: true,
            banner: { js: bannerText },
            external: ['jquery'],  // Treat jQuery as an external dependency
            legalComments: 'none'  // Remove all legal comments
        });
    } catch (error) {
        console.error('Error building JS:', error);
        process.exit(1);
    }
}

async function build() {
    await buildScss();
    await buildJs();
}

build();
