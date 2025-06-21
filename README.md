# LiteView

**LiteView** is the ultra-light, declarative, and algorithmic UI library that lets you build beautiful interfaces with pure JavaScript—effortlessly and intuitively.

Design, animate, and compose interactive UIs with a single, fluent API. Write less code, achieve more.

---

## ✨ Why LiteView?

- **Minimalist**: No dependencies, no complex build steps—just pure JavaScript magic.
- **Truly Declarative**: Describe your UI, chain your styles and logic, and watch it happen.
- **Algorithmic Power**: Flexible enough for dynamic layouts and advanced effects.
- **Animation Built-In**: Create smooth, chained, spring or time-based animations with zero hassle.
- **Extensible**: Easily add or override behaviors, create custom components.
- **Developer Joy**: Readable, chainable, fun to use—perfect for prototyping or production.

---

## 🚀 Quick Start
![status: unstable](https://img.shields.io/badge/status-unstable-orange)

> ⚠️ **Status:** LiteView is currently in active development and its API may change. Not recommended for critical production use. Use with caution—ideal for prototypes, small and medium projects for now.

```bash
npm install @harun-aksoy/lite-view
```

```js
import {View} from 'lite-view';

View('Hello, World!')
  .color('white')
  .padding(18, 32)
  .radius(12)
  .color('royalblue')
  .parent(document.body)
```

---

## 🪄 Core API Example

### Build Nested UIs Declaratively

```js
import {View} from 'lite-view';

const app = 
  View(
    View('LiteView Demo')
      .color('white')
      .padding(8, 20)
      .radius(8)
      .color('orange'),
    View('So easy, so declarative!')
      .color('white')
      .padding(8, 20)
      .radius(8)
      .color('mediumseagreen')
  )
  .frame(Infinity,Infinity)
  .color('#23272f')
  .parent(document.body)
```

---

### ⚡ Animate Anything

```js
const box3 = View().parent(box2)
.color('cyan').frame(10,10).position(0,100)
.animation
    .ease("easeInOut",2)
    .delay(0.5)
    .repeat(Infinity)
    .reverse(true)
    .spring({ damping: 5, stiffness: 15 })
    .start((self,p) => {
      self.offset(100*p);
    })
```

---

### 🎉 Event Handling is a Breeze

```js
View('Click me!')
  .color('white')
  .color('purple')
  .padding(12, 28)
  .radius(999)
  .on('click', self => {
    self.color('gold');
    alert('You clicked!');
  })
  .parent(document.body)
```

---

### 🏗️ Create Reusable Components

```js
function Card(title, content) {
  return View(
    View(title).font.size(22).color('white'),
    View(content).color('white').opacity(0.9)
  )
  .color('#2c3e50')
  .radius(12)
  .padding(18, 24)
  .shadow('rgba(0,0,0,0.25)', 12, 0, 8);
}

Card('LiteView', 'Reusable UI components made easy!').parent(document.body)
```

---

## 📚 API Reference (Highlights)

| Method           | Description                                 |
|------------------|---------------------------------------------|
| `.color(value)`  | Sets background or text color               |
| `.frame(w,h)`    | Sets width & height                         |
| `.padding(...)`  | Sets inner spacing                          |
| `.radius(...)`   | Sets border radius                          |
| `.on(event, cb)` | Adds event listener                         |
| `.animation...`  | Controls animation chain                    |
| `.parent(el)`    | Appends to parent element                   |
| `.child(...)`    | Adds or gets children                       |
| `.clone()`       | Deep clones the View                        |
| `.tags(...)`     | Sets or gets CSS class names                |
| `.name(val)`     | Sets or gets element ID                     |
| `.destroy()`     | Removes and cleans up the View              |

And many more—you can chain them all!

---

## 💡 Tips

- You can extend with your own methods/components.
- Built-in support for drag/drop, responsive handlers, custom fonts, Markdown rendering, and more.
- Designed for both rapid prototyping and production use.

---

## 🔗 Live Demo

_Try it online soon!_

---

LiteView: Write UI like you always wanted—fast, readable, declarative, joyful.
