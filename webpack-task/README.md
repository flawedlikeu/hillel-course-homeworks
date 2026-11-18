# MiniShop — Webpack

Домашнє завдання Hillel: дві сторінки магазину (каталог і кошик), зібрані власним конфігом Webpack 5.

## Запуск

```bash
npm install
npm start        # dev-сервер з hot reload: http://localhost:8080
npm run build    # production-збірка в dist/
npm run analyze  # production-збірка + інтерактивна карта розміру бандла
```

## Що реалізовано у `webpack.config.js`

| Вимога | Як зроблено |
| --- | --- |
| **Хешування імен файлів** | У production усі JS, CSS, шрифти й картинки отримують `[contenthash:8]` в імені (`js/index.c8c1315e.js`). Хеш змінюється лише коли змінюється вміст файлу, тож браузер не тримає застарілий кеш. `runtimeChunk: 'single'` і `moduleIds: 'deterministic'` тримають хеші стабільними між збірками. `output.clean` очищає `dist/` перед кожною збіркою. |
| **Локальні шрифти** | Montserrat 400/600/700 у форматі `woff2` лежать у `src/fonts/` і підключаються через `@font-face` у `src/css/fonts.css`. Правило `asset/resource` копіює їх у `dist/fonts/` з хешем. `unicode-range` — браузер вантажить лише потрібні файли (латиниця/кирилиця), `font-display: swap` — текст видно одразу. |
| **Зображення** | Тип `asset`: файли до 4 КБ (`logo.svg`, `favicon.svg`, `empty-cart.svg`) вбудовуються як data URI — мінус зайві запити. Більші (`hero.svg`) копіюються в `dist/images/` з хешем. Картинки підхоплюються і з HTML (`html-loader`), і з CSS (`url()` через `css-loader`). |
| **CSS** | `css-loader` + у dev `style-loader` (швидкий HMR), у prod `MiniCssExtractPlugin` — окремий кешований `.css` файл, мініфікований `CssMinimizerPlugin`. Спільні стилі обох сторінок винесені в один `styles.[hash].css`. |
| **Оптимізація зовнішніх бібліотек** | Використовується `lodash-es` з іменованими імпортами (`import { debounce, orderBy } from 'lodash-es'`) — завдяки ES-модулям і tree-shaking у збірку йдуть лише потрібні функції, а не весь lodash. `splitChunks` виносить бібліотеки в окремий `vendors.[hash].js`, спільний для обох сторінок і довго живучий у кеші; спільний власний код — у `common.[hash].js`. JS мініфікується `TerserPlugin`. `npm run analyze` показує склад бандла. |

## Структура

```
src/
├── pages/        index.html, cart.html (шаблони для HtmlWebpackPlugin)
├── js/
│   ├── pages/    точки входу: index.js, cart.js
│   └── modules/  cart-store.js (localStorage), ui.js, mock-data.js
├── css/          styles.css, fonts.css
├── fonts/        Montserrat *.woff2
└── images/       logo, favicon, hero, empty-cart (SVG)
```

## Функціонал

- Каталог: пошук за назвою, фільтр за категорією й ціною, сортування, додавання в кошик.
- Кошик: зміна кількості, видалення, очищення, підсумок. Дані зберігаються в `localStorage`, лічильник у шапці синхронізується між вкладками.
