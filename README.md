# moonbots.js
Простой враппер для использования API [Moonbots](https://moonbots.xyz).

## Установка
```sh
$ npm install moonbots.js
```

## Инициализация
```js
let apiKey = "СуперСекретныйАПИключ";
// API ключ можно получить на странице редактирования вашего бота

const moonbotsjs = require("moonbots.js");
const moonbots = new moonbotsjs(apiKey);
```

## Примеры кода
```js
// Установить автопубликацию статистики к нам на API
moonbots.setAutoPost(client);

// Получение информации о боте по ID
moonbots.getInfo('840235736993366037')
```