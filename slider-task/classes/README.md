# Slider (classes)

Слайдер на класах: `Slider` — базова функціональність, `DragSlider extends Slider` — drag мишею та touch.
Елементи керування створюються динамічно через JS. Додатково: автопауза при наведенні миші.

## Конфігурація

`new DragSlider(element, options)`

| Опція | Тип | За замовчуванням | Опис |
|---|---|---|---|
| interval | number | 3000 | Інтервал автопрогортання, мс |
| autoplay | boolean | true | Запускати автопрогортання |
| showArrows | boolean | true | Кнопки prev/next |
| showDots | boolean | true | Індикатори слайдів |
| showPauseButton | boolean | true | Кнопка паузи |
| pauseOnHover | boolean | true | Пауза при наведенні миші |
| swipeThreshold | number | 50 | Мін. відстань перетягування, px |
