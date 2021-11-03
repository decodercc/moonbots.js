const fetch = require("node-fetch");
const Discord = require('discord.js');
const FLS = false;
// const emt = require('emitter');
const wsr = require('ws');

const { base_url, wsrr, wsprefix,prefix, errorColor, defaultColor } = require("./_cfg.js");

function nError(message, exit) {
  if(exit && exit !== false) {
    console.log(errorColor, prefix + message, defaultColor);
    return process.exit();
  } else {
    return console.log(errorColor, prefix + message, defaultColor);
  }
}
function nLog(message) {
      return console.log(defaultColor, prefix + message, defaultColor);
}
function nWSLog(message) {
  return console.log(defaultColor, wsprefix + message, defaultColor);
}
function nFLog(message) {
  return console.log(prefix + message);
}
function nLogWPT(message) {
  return console.log(defaultColor, prefix + new Date() + message, defaultColor);
}

class APIWrapper {

  constructor(token, options) {

    if(!token) return nError("Вы должны указать токен API!", true);
    this.token = token;

    if(FLS == true) {
    this.ws = new wsr.WebSocket(wsrr);
    this.ws.on('error', err => {
      return nWSLog('Websocket не подключён: ' + err)
    })
    this.ws.on('open', function open() {
      return nWSLog('Websocket подключен');
    });
    this.ws.on('close', event => {
      if (event.wasClean) {
        nWSLog('Соединение закрыто вами.');
      } else {
        nWSLog('Ошибка соединения с Websocket Moonbots.');
      }
    });
    this.ws.on('message', function incoming(message) {
        nWSLog('Получено сообщение от сервера: ' + message);
      });
    }
    return this;
  }

  /*
  * getInfo ASYNC
  * @param botID(Number | String) - The bot's id
  * @return content(Object) - GetInfo request's response
  */

  async getInfo(botID) {
      let content = await fetch(`${base_url}/bots/${botID}/botinfo`).then(d => d.json())
      if(content.code == 400 || content.code == 404) return nError('По указанному ID не был найден бот.');
      return content;
  }

  /*
  * setAutoPost ASYNC
  * @param client(Discord.Client(discord.js:12.x-13.x)) - Bot's client object
  * @param interval(Number = 1800000(30min)) - The statistics send interval in ms
  */

  async setAutoPost(client, interval = 1800000) {
    if(!client) return nError('Вы не указали константу клиента!')

    if(interval && interval < 900000) return nError("Отправка статистики возможна не менее одного раза в 15 минут!");

    let s = await (await fetch(`${apr}/api/auth/stats/${client.user.id}`, {
      method: 'POST',
      body: JSON.stringify({ servers: client.guilds.cache.size }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.token
      },
    })).json();
    if(s.success == 'false') return nError('Ошибка отправки статистики! ' + s.error);
    if(s.success == true) return nLogWPT(' Статистика успешно отправлена на API Moonbots! ' + JSON.stringify(s))
};
};

module.exports = APIWrapper
