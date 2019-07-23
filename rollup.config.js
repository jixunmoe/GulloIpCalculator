import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import buble from 'rollup-plugin-buble';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;
const useSourceMap = !!process.env.ROLLUP_SOURCEMAP;

const sourceMap = useSourceMap || !production;

const getPlugins = (esVer) => {
    return [
        resolve(), // tells Rollup how to find modules in node_modules
        commonjs(), // convert to ES modules
        buble(),
        production && terser({
            compress: {
                drop_console: true,
                keep_fargs: false,
                passes: 3,
                // unsafe_arrows: esVer >= 6,
                unsafe_comps: true,
                unsafe_methods: esVer >= 6,
                unsafe_proto: true,
                warnings: true,
            },
            ecma: esVer,
            module: true,
        }),
        production && filesize()
    ];
};

const ext = production ? 'min.js' : 'js';

const OUT_DIR = process.env.OUT_DIR || 'public';

export default {
    input: 'src/app.js',
    output: {
        file: `${OUT_DIR}/bundle.${ext}`,
        format: 'iife', // immediately-invoked function expression — suitable for <script> tags
        sourcemap: sourceMap
    },
    plugins: getPlugins(production ? 6 : false),
};
