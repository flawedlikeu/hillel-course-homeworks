# MiniShop — Webpack Advanced

Домашнє завдання Hillel: продовження [webpack-task](../webpack-task). Дві сторінки магазину (каталог і кошик) на розширеному конфігу Webpack 5.

## Запуск

```bash
npm install
npm start          # DevServer: http://localhost:8080, HMR + live reload
npm run build      # production-збірка в dist/
npm run analyze    # збірка + звіт Bundle Analyzer (dist/bundle-report.html)
npm run lint       # перевірка ESLint
npm run lint:fix   # автовиправлення ESLint
npm run typecheck  # перевірка типів TypeScript
```

## Що реалізовано

| Вимога | Як зроблено |
| --- | --- |
| **DevServer** | `webpack-dev-server`: `hot` (HMR для стилів), `liveReload` (перезавантаження сторінки при змінах JS/TS і HTML через `watchFiles`), `open`, `compress`, оверлей з помилками компіляції. |
| **Зовнішні CSS файли** | `modern-normalize` підключається прямо з `node_modules` (`import 'modern-normalize/modern-normalize.css'`), локальний `fonts.css` — окремим файлом. Обробка через `css-loader`; у dev — `style-loader`, у prod — `MiniCssExtractPlugin` + `CssMinimizerPlugin`. |
| **LESS та Sass/SCSS** | `src/styles/main.scss` (`sass-loader`): змінні, `map`, міксини з `@content`, вкладеність, `color.adjust`. `src/styles/cart.less` (`less-loader`): змінні, міксини з параметрами, вкладеність, змінна з медіазапитом. SCSS — спільні стилі (`styles.[hash].css`), LESS — лише для кошика (`cart.[hash].css`). |
| **TypeScript** | `ts-loader` + `tsconfig.json` (strict). На TS написані дані, типи, логіка кошика й фільтрів: `src/ts/*.ts`. `resolve.extensions` дозволяє імпортувати їх з JS без розширення. |
| **Babel** | `babel-loader` + `@babel/preset-env` для всіх `.js`. Цільові браузери беруться з `browserslist` у `package.json`, `cacheDirectory` пришвидшує повторні збірки. |
| **ESLint** | Flat-конфіг `eslint.config.mjs` (`@eslint/js` + `typescript-eslint`) і `eslint-webpack-plugin` — код перевіряється під час кожної збірки. У production помилки ESLint зупиняють збірку, у dev — показуються в консолі. |
| **Bundle Analyzer** | `npm run analyze` запускає `webpack-bundle-analyzer` і зберігає інтерактивну карту бандла в `dist/bundle-report.html`. |

Також з попереднього завдання: хеші в іменах файлів, локальні шрифти, робота із зображеннями, `vendors`/`common`/`runtime` чанки, tree-shaking `lodash-es`.

## Структура

```
src/
├── pages/        index.html, cart.html
├── js/           ui.js, pages/index.js, pages/cart.js   (Babel)
├── ts/           types.ts, mock-data.ts, cart-store.ts, filters.ts   (TypeScript)
├── styles/       main.scss, cart.less, fonts.css
├── fonts/        Montserrat *.woff2
└── images/       SVG
```
