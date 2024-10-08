# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

```css

/* 默认 1rem = 16， 可以通过调整html字体大小调整rem */

/* size */
w-1: 0.25rem
w-[100px]: width: 100px
h-[1rem]: height: 1rem;
min-w-1: min-width: 0.25rem;
min-w-[100px]: min-width: 100px;
min-h-1: min-height: 0.25rem;
w-full: width: 100%;
h-full: height: 100%;
size-1: width: 0.25rem; height: 0.25rem;
size-[100px]: width: 100px; height: 100px;
size-full: width: 100%; height: 100%;

/* padding, margin同理 */
po-0: padding: 0;
px-0: padding-left: 0; padding-right: 0;
py-0: padding-top: 0; padding-bottom: 0;
pt-0: padding-top: 0
pr-0: padding-top: 0
pb-0: padding-top: 0
pl-0: padding-top: 0

/* font */
text-[14px]: font-size: 14px
leading-3: line-height: .75rem
text-[#50d71e]: color: #50d71e
leading-[100px]: line-height: 100px
leading-none: line-height: 1;
tracking-[10px]: letter-spacing: 10px;
italic: font-style: italic;
not-itali: font-style: normal;
font-[500]: font-weight: 500;
text-left: text-align: left;
text-center: text-align: center;
text-right: text-align: right;
text-justify: text-align: justify;
text-start: text-align: start;
text-end: text-align: end;

/* Backgrounds */
bg-[#50d71e]: background-color: #50d71e;
bg-bottom: background-position: bottom;
bg-center: background-position: center;
bg-left: background-position: left;
bg-left-bottom: background-position: left bottom;
bg-left-top: background-position: left top;
bg-right: background-position: right;
bg-right-bottom: background-position: right bottom;
bg-right-top: background-position: right top;
bg-top: background-position: top;
bg-repeat: background-repeat: repeat;
bg-no-repeat: background-repeat: no-repeat;
bg-repeat-x: background-repeat: repeat-x;
bg-repeat-y: background-repeat: repeat-y;
bg-cover: background-size: cover;
bg-contain: background-size: contain;
bg-[url('/img/hero-pattern.svg')]: background-image: url('/img/hero-pattern.svg')

/* border */
rounded-none: border-radius: 0px;
rounded: border-radius: 0.25rem;
rounded-[12px]: border-radius: 12px;
borde-0: border-width: 0px;
borde: border-width: 1px;
border-x-*: border-left-width: *; border-right-width: *;
border-y-*: border-top-width: *; border-bottom-width: *;
border-t-*: border-top-width: *;
border-r-*: border-right-width: *;
border-b-*: border-bottom-width: *;
border-l-*: border-left-width: *;
border-[#243c5a]: border-color: #243c5a; // 同时支持border-x[],border-x[],border-y[],border-t[],border-r[],border-b[],border-l[];
border-solid: border-style: solid;
border-dashed: border-style: dashed;
border-dotted: border-style: dotted;
border-double: border-style: double;
border-hidden: border-style: hidden;
border-none: border-style: none;

divide-x: border-right-width: 0px; border-left-width: 1px;
divide-y: border-top-width: 1px; border-bottom-width: 0px;
divide-[red]: border-color: red;
divide-solid: border-style: solid;
divide-dashed: border-style: dashed;
divide-dotted: border-style: dotted;
divide-double: border-style: double;
divide-none: border-style: none;

/* shadow */
shadow: box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]: box-shadow: 0, 35px, 60px. -15px, rgba(0,0,0,0.3)

/* transition */
transition-none: transition-property: none;
transition-all: transition-property: all;
transition-colors // 所有颜色相关的属性，
transition-opacity // opacity
transition-shadow // shadow
transition-[height]: transition-property: height;
duration-*: transition-duration: *;
ease-linear: transition-timing-function: linear;
ease-in: transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
ease-out: transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
ease-in-out: transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
ease-[cubic-bezier(0.95,0.05,0.795,0.035)]: transition-timing-function: cubic-bezier(0.95,0.05,0.795,0.035)
delay-*: transition-delay: *;
animate-none: animation: none;
animate-spin: animation: spin 1s linear infinite;

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
animate-ping: animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
animate-pulse: animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
animate-bounce: animation: bounce 1s infinite;

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}


/* transform */
scale-*: transform: scale(*);
rotate-*: transform: rotate(*);
translate-y-*: transform: translateY(*);
translate-x-*: transform: translateX(*);
translate-x-*: transform: translateX(*);
translate-y-*: transform: translateY(*);

/* other */




```
