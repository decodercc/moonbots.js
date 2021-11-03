const fetch = require("node-fetch");
const Discord = require("discord.js")
const wsr = require('ws');

const { base_url, websocket_base_url, message_websocket_prefix,message_prefix, error_color, default_color } = require("./cfg.json");

function nError(message, exit) {
  if(exit && exit !== false) {
    console.log(error_color, message_prefix + message, default_color);
    return process.exit();
  } else {
    return console.log(error_color, message_prefix + message, default_color);
  }
}
function nLog(message) {
      return console.log(default_color, message_prefix + message, default_color);
}
function nWSLog(message) {
  return console.log(default_color, message_websocket_prefix + message, default_color);
}
function nFLog(message) {
  return console.log(message_prefix + message);
}
function nLogWPT(message) {
  return console.log(defaultc_color, message_prefix + new Date() + message, default_color);
}

class APIWrapper {

  /*
  * @constructor APIWrapper
  * @param token(String) - MoonBots API token
  * @param options(Object(
  *   @param FLS(Boolean) - WTF
  * )
  * @return this(APIWrapper) - Returns the instance of this class
  */

  constructor(token, options) {

    if(!token) return nError("Вы должны указать токен API!", true);
    this.token = token;

    /*Пользы в этом коде я не вижу
    if(options.FLS == true) {
      this.ws = new wsr.WebSocket(websocket_base_url);
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
    }*/

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
  * setAutoPost
  * @param client_id(Number | String) - Bot's id
  * @param guilds_amount(Number) - Guilds amount
  * @param interval(Number = 1800000(30min)) - The statistics send interval in ms
  * @return interval(IntervalObject) - The auto-post interval object
  */

  setAutoPost(client_id,guilds_amount, interval = 1800000) {
    if(!client) return nError('Вы не указали константу клиента!')
    if(interval && interval < 900000) return nError("Отправка статистики возможна не менее одного раза в 15 минут!");
    if(!guild_amount instanceof Number && !Number(guild_amount)) return nError("Кол-во гильдий должно быть представлено численным значением")
    
    return setInterval(this._setStats,interval, client_id, guilds_amount)
  };

  /*
  * _setStats ASYNC PRIVATE
  * @param clientID(String | Number) - This bot's client id
  * @param guilds_amount(Number) - Amount of guilds
  */

  async _setStats(clientID, guilds_amount){
    let s = await (await fetch(`${base_url}/api/auth/stats/${clientID}`, { method: 'POST', body: JSON.stringify({ servers: guilds_amount }), headers: { 'Content-Type': 'application/json', 'Authorization': this.token}, })).json();
    if(s.success == 'false') return nError('Ошибка отправки статистики! ' + s.error);
    if(s.success == 'true') return nLogWPT(' Статистика успешно отправлена на API Moonbots! ' + JSON.stringify(s))
  }
};

module.exports = APIWrapper
