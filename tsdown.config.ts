import { defineConfig } from 'tsdown';
import postcssImport from 'postcss-import';
import cssnanoPlugin from 'cssnano';
import * as sassEmbedded from 'sass-embedded'
import { writeFileSync } from 'fs';
import postcss from 'postcss';

const createPostcssPlugins = [
  postcssImport(),
  cssnanoPlugin({ preset: ['default'] }),
]

const generateBaseStylesCss = () => ({
  name: 'generate-base-styles-css',
  async writeBundle() {
    const sourceFilePath = './src/styles.module.scss'
    const outputFilePath = './lib/stylesSass.css'
    const sassCompileOptions = {
      loadPaths: ['node_modules', 'src'],
    }

    // сначала пробуем sass-embedded (быстрее), при ошибке fallback на sass
    let sassResult = await sassEmbedded.compileAsync(
      sourceFilePath,
      sassCompileOptions
    )

    const processedCss = await postcss(createPostcssPlugins).process(sassResult.css, { from: sourceFilePath })

    writeFileSync(outputFilePath, processedCss.css)
    console.log(`Generated base styles css: ${outputFilePath}`)
  },
})

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'lib',
  format: ['esm', 'cjs'],
  platform: 'browser',
  minify: true,
  clean: true,
  css: {
    minify: true,
    transformer: 'postcss',
    postcss: {
      plugins: createPostcssPlugins,
    },
    modules: {
      generateScopedName: (name) => `ui-${name}`,
    },
    fileName: 'styleTsDown.css',
  },
  plugins: [generateBaseStylesCss()],

})
