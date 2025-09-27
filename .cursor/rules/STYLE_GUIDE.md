# Style Guide (Собран на основе `styles/`)

Этот гайд агрегирует переменные и правила из:
- `styles/_vars/_colors.css`
- `styles/_vars/_core.css`
- `styles/_vars/_theme/_light.css`
- `styles/_vars/_theme/_dark.css`
- `styles/globals.css`

## 1) Архитектура токенов

- **Base color tokens**: скейлы `primary`, `secondary`, `ettention`, `positive`, `negative`, `gray` (шаги 50–950).
- **Semantic tokens**: `--text-*`, `--background`, `--card`, `--popover`, `--primary`, `--secondary`, `--ettention`, `--positive`, `--negative`, `--muted`, `--accent`, `--destructive`, `--border-color`, `--input`, `--ring`, а также `--chart-1..5`.
- **Radii**: `--radius-xs`…`--radius-4xl`.
- **Typography sizes**: `--h1`…`--h5`, `--p-*`, `--button-*`, `--label-*`.
- **RGB-значения** для outline/свечение: `--rgb-primary`, `--rgb-secondary`, `--rgb-ettention`, `--rgb-positive`, `--rgb-negative`, `--rgb-gray`.

## 2) Светлая/Тёмная темы

- Светлая тема задаётся на `:root` (`_light.css`), тёмная — на `.dark` (`_dark.css`). Переключение тем — добавлением/удалением класса `dark` на корневом контейнере.
- В темах определены семантические переменные (см. `semantic-theme-tokens.json`).

## 3) Tailwind v4 интеграция

- Файл `styles/globals.css` использует синтаксис `@theme inline` и `@custom-variant dark` (Tailwind v4). Все `--color-*` переменные ссылаются на семантические токены.
- Подключение:
  ```tsx
  // app/layout.tsx
  import './styles/globals.css';
  export default function RootLayout({ children }) { 
    return <html className="" lang="ru"><body>{children}</body></html>;
  }
  ```
- Переключение темы:
  ```ts
  document.documentElement.classList.toggle('dark', prefersDarkOrUserChoice);
  ```

## 4) Карта семантических цветов (light/dark)

См. `semantic-theme-tokens.json`. Примеры ключей:
- Текст: `--text-primary/secondary/tertiary/foreground`
- Поверхности: `--background`, `--card`, `--popover`
- Акцентные: `--primary`, `--secondary`, `--ettention` (внимание), `--positive`, `--negative`
- Системные: `--muted`, `--accent`, `--destructive`, `--ring`, `--input`, `--border-color`

## 5) Рекомендации по состояниям

- Hover: использовать `--*-hover` где определено, иначе изменять яркость ±6–8%.
- Disabled: `--*-disabled` (если есть) либо `opacity:.5; pointer-events:none`.
- Focus: `outline`/`box-shadow` с использованием `--rgb-primary` и `--ring`.

## 6) Типографика и радиусы

- Значения берутся из `--h*`, `--p-*`, `--button-*`, `--label-*` и `--radius-*` (см. `design-tokens-from-css.json` и `_core.css`).

## 7) Цветовые скейлы

- Полные скейлы собраны автоматически в `design-tokens-from-css.json`.
- Превью палитр: см. `color-swatches.png`.

## 8) Пример использования в компонентах

```tsx
<button className="rounded-[var(--radius-lg)] bg-[var(--primary)] text-[var(--primary-foreground)] px-4 h-11
  hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]">
  Primary
</button>

<input className="h-11 rounded-[var(--radius-lg)] bg-[var(--card)] border border-[color:rgb(var(--border-color))] px-3
  placeholder:text-[var(--text-tertiary)] text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]" />
```

## 9) Совместимость с shadcn/ui

- Привязывайте цвета к CSS-переменным через классы `bg-[var(--primary)]`, `text-[var(--text-primary)]` и т.д.
- Для chart-компонентов можно использовать `--chart-1..5` (HSL).

---

### Экспорт

- `design-tokens-from-css.json` — базовые скейлы и RGB.
- `semantic-theme-tokens.json` — карта семантических токенов для light/dark.
- `color-swatches.png` — превью цветов.

