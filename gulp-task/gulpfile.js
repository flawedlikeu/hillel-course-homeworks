import gulp from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import rename from 'gulp-rename';
import browserSync from 'browser-sync';
import stylelint from 'stylelint';
import postcssScss from 'postcss-scss';
import reporter from 'postcss-reporter';
import * as prettier from 'prettier';
import { deleteAsync } from 'del';
import { Transform } from 'node:stream';

const { src, dest, watch, series, parallel } = gulp;
const sass = gulpSass(dartSass);
const server = browserSync.create();

const paths = {
  html: 'src/*.html',
  scss: 'src/scss/**/*.scss',
  scssEntry: 'src/scss/main.scss',
  images: 'src/images/**/*',
  dist: 'dist',
};

// Gulp-плагін-обгортка над Prettier: форматує вміст кожного файлу в потоці
function prettierStream() {
  return new Transform({
    objectMode: true,
    async transform(file, _enc, done) {
      if (file.isNull()) return done(null, file);
      try {
        const options = (await prettier.resolveConfig(file.path)) ?? {};
        const formatted = await prettier.format(file.contents.toString(), {
          ...options,
          filepath: file.path,
        });
        file.contents = Buffer.from(formatted);
        done(null, file);
      } catch (err) {
        done(err);
      }
    },
  });
}

// Очищення папки збірки
export const clean = () => deleteAsync([paths.dist]);

// Стайлінг базового коду: перевірка SCSS через Stylelint
export const lint = () =>
  src(paths.scss).pipe(
    postcss([stylelint(), reporter({ clearReportedMessages: true })], {
      syntax: postcssScss,
    }),
  );

// Стайлінг базового коду: форматування вихідних SCSS/HTML через Prettier (перезапис у src)
export const format = () =>
  src([paths.scss, paths.html], { base: 'src' })
    .pipe(prettierStream())
    .pipe(dest('src'));

// SCSS -> CSS + вендорні префікси + форматування (style.css) + мініфікація (style.min.css)
export const styles = () =>
  src(paths.scssEntry, { sourcemaps: true })
    .pipe(sass({ style: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(prettierStream()) // стайлінг кінцевого коду
    .pipe(rename('style.css'))
    .pipe(dest(`${paths.dist}/css`))
    .pipe(postcss([cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })]))
    .pipe(rename('style.min.css'))
    .pipe(dest(`${paths.dist}/css`, { sourcemaps: '.' }));

export const html = () => src(paths.html).pipe(dest(paths.dist));

export const images = () =>
  src(paths.images, { encoding: false, allowEmpty: true }).pipe(dest(`${paths.dist}/images`));

// Локальний сервер з live reload
function serve(done) {
  server.init({
    server: { baseDir: paths.dist },
    notify: false,
    open: false,
    port: 3000,
  });
  done();
}

function reload(done) {
  server.reload();
  done();
}

// Підміна CSS у браузері без повного перезавантаження сторінки
function injectCss(done) {
  server.reload('*.css');
  done();
}

function watchFiles() {
  watch(paths.scss, series(lint, styles, injectCss));
  watch(paths.html, series(html, reload));
  watch(paths.images, series(images, reload));
}

export const build = series(clean, lint, parallel(styles, html, images));

export default series(build, serve, watchFiles);
