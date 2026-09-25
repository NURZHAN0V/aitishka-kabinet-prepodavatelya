# Кабинет преподавателя

Поддомен: (планируется) · Школа: [itcampsochi.ru](https://itcampsochi.ru/)

## Документация

| Файл | Содержание |
| --- | --- |
| [docs/README.md](docs/README.md) | Оглавление |
| [docs/kontekst.md](docs/kontekst.md) | Контекст школы |
| [docs/produkt.md](docs/produkt.md) | Ссылка на продуктовую спецификацию |
| [docs/dizayn.md](docs/dizayn.md) | UI-kit и токены |
| [docs/ekrany.md](docs/ekrany.md) | Экраны и навигация |

Экосистема: [`../docs/README.md`](../docs/README.md) · продукт: [`../docs/kabinet-prepodavatelya.md`](../docs/kabinet-prepodavatelya.md)

---

## Правила разработки (Vue)

Источник практик: локальный репозиторий `vue-faq` (`/Users/nurzhanov/GitHub/vue-faq`, разделы `docs/ru/`).

### Стек

- **Vue 3**, **Composition API**, синтаксис `<script setup>`
- **Vite** — сборщик
- **SCSS** — основной способ стилей; в компонентах `<style lang="scss" scoped>`
- **vue-router** — маршрутизация SPA
- **Свой UI-kit** — `Base*` в `core/components/ui/`, без сторонних UI-библиотек
- Язык интерфейса — **русский**

### Зависимости

**По умолчанию — не ставить.** Новый npm-пакет только если без него задачу нельзя решить разумно своим кодом.

**Не ставить:** UI-фреймворки (Quasar, PrimeVue, Vuetify, Tailwind), Pinia (пока хватает composables), `@hugeicons/vue` и CDN-иконки.

Разрешённые на старте: `vue`, `vue-router`, `vite`, `@vitejs/plugin-vue`, `sass`.

Менеджер пакетов в проекте — **npm**.

### Архитектура

```txt
src/
├── core/
│   ├── components/ui/   # BaseButton, BaseCard, …
│   ├── composables/
│   ├── layouts/
│   └── api/
├── assets/styles/       # tokens, mixins, fonts, main
├── modules/             # доменные фичи
├── views/
├── App.vue
└── main.js
```

- **`core/components/ui/`** — переиспользуемый UI-kit
- **`modules/*`** — доменные компоненты и моки
- Состояние — composables с `ref`/`reactive`, не Pinia

### Иконки

Только **локальные Hugeicons SVG** в `src/assets/icons/hugeicons/` через `<BaseIcon name="…" />`.
Иллюстрации AVIF в этом клиенте **не используем**.

### SCSS

- Глобально `src/assets/styles/main.scss` в `main.js`
- Токены: `@use '@/assets/styles/tokens' as *;`
- Палитра как в дневнике: primary `#8b5cf6`, page `#f5f7fa`

### Качество

- `npm run build` должен проходить после значимых изменений
- Не дублируй продуктовую логику — она в `../docs/kabinet-prepodavatelya.md`
- localStorage: префикс `kabinet-prepodavatelya:`
