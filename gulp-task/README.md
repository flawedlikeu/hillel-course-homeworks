# Gulp Starter

Домашнє завдання Hillel: веб-проєкт, зібраний за допомогою **Gulp**.

- **Сторінка (GitHub Pages):** https://flawedlikeu.github.io/hillel-course-homeworks/gulp-task/dist/
- **Код:** https://github.com/flawedlikeu/hillel-course-homeworks/tree/main/gulp-task

## Можливості збірки

| Вимога | Як реалізовано |
| --- | --- |
| Препроцесор SCSS | `gulp-sass` + `sass` компілюють `src/scss/main.scss` у CSS |
| Оновлення сторінки в реальному часі | `browser-sync`: зміни SCSS підставляються без перезавантаження, зміни HTML оновлюють сторінку |
| Вендорні префікси | `autoprefixer` (цільові браузери — поле `browserslist` у `package.json`) |
| Стайлінг базового коду | `stylelint` (`stylelint-config-standard-scss`) перевіряє SCSS; `gulp format` форматує SCSS і HTML через `prettier` |
| Стайлінг кінцевого коду | скомпільований CSS проходить через `prettier` → читабельний `dist/css/style.css` |
| Мінімізація стилів | `cssnano` створює `dist/css/style.min.css` (без пробілів і коментарів) + source map |

## Вимоги

- Node.js 18+ (перевірено на Node 24)
- npm

## Встановлення та запуск

```bash
cd gulp-task
npm install
```

Режим розробки (збірка + локальний сервер на http://localhost:3000 + live reload):

```bash
npm start
```

Продакшн-збірка в папку `dist/`:

```bash
npm run build
```

Інші команди:

```bash
npm run lint     # перевірка SCSS через stylelint
npm run format   # форматування src/ через prettier
```

## Gulp-задачі

| Задача | Опис |
| --- | --- |
| `gulp` | `build` → сервер → стеження за файлами |
| `gulp build` | очищення `dist`, lint, стилі, HTML, зображення |
| `gulp styles` | SCSS → CSS → префікси → prettier → `style.css` → cssnano → `style.min.css` |
| `gulp lint` | stylelint для `src/scss/**/*.scss` |
| `gulp format` | prettier для `src/scss` і `src/*.html` |
| `gulp clean` | видалення `dist` |

## Структура

```
gulp-task/
├── gulpfile.js
├── package.json
├── .stylelintrc.json
├── .prettierrc.json
├── src/                    # вихідний код
│   ├── index.html
│   ├── images/
│   └── scss/
│       ├── main.scss
│       ├── abstracts/      # змінні, міксини
│       ├── base/           # reset, базові стилі
│       └── components/     # header, hero, features, footer
└── dist/                   # результат збірки (публікується на GitHub Pages)
    ├── index.html
    └── css/
        ├── style.css
        ├── style.min.css
        └── style.min.css.map
```

## Публікація на GitHub Pages

Папка `dist/` комітиться в репозиторій, тому GitHub Pages віддає її напряму:

1. `npm run build`
2. Закомітити та запушити зміни (разом із `dist/`)
3. **Settings → Pages → Source:** `Deploy from a branch`, гілка `main`, папка `/ (root)`
4. Сторінка буде доступна за адресою `https://flawedlikeu.github.io/hillel-course-homeworks/gulp-task/dist/`
