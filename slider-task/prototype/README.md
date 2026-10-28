# Slider (prototype)

Слайдер на прототипах: `Slider` — базова функціональність, `DragSlider` наслідує його й додає drag мишею та touch.
Елементи керування (стрілки, пауза, індикатори) створюються динамічно через JS.

## Конфігурація

`new DragSlider(element, options)`

| Опція | Тип | За замовчуванням | Опис |
|---|---|---|---|
| interval | number | 3000 | Інтервал автопрогортання, мс |
| autoplay | boolean | true | Запускати автопрогортання |
| showArrows | boolean | true | Кнопки prev/next |
| showDots | boolean | true | Індикатори слайдів |
| showPauseButton | boolean | true | Кнопка паузи |
| swipeThreshold | number | 50 | Мін. відстань перетягування, px |
