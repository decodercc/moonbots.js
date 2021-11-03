const fetch = require("node-fetch");
const Discord = require('discord.js');
const FLS = false;
// const emt = require('emitter');
const wsr = require('ws');

const { base_url, ws_base, wsprefix, prefix, error_color, default_color } = require("./_cfg.js");

function nError(message, exit) {
  if(exit && exit !== false) {
    console.log(error_color, prefix + message, default_color);
    return process.exit();
  } else {
    return console.log(error_color, prefix + message, default_color);
  }
}
function nLog(message) {
      return console.log(default_color, prefix + message, default_color);
}
function nWSLog(message) {
  return console.log(default_color, wsprefix + message, default_color);
}
function nFLog(message) {
  return console.log(prefix + message);
}
function nLogWPT(message) {
  return console.log(default_color, prefix + new Date() + message, default_color);
}

module.exports = class MoonbotsJS {
  constructor(token, options) {
    if(!token) return nError("Вы должны указать токен API!", true);
    // if(!client) return nError("Вы должны указать константу клиента!", true);
    // return nError('Вы указали неверный токен API!');

    this["token"] = token;
    // this.emitter = new emt.EventEmitter()
    // this["client"] = client;
    this._events = {};

    return this;
  }

  /**
  * getInfo
  * @param botID(Number | String) - The bot's id
  * @return content(Object) - GetInfo request's response
  */
  async getInfo(botid) {
      let ff = await fetch(`${base_url}/bots/${botid}/botinfo`);
      let f = await ff.json();
      if(f.code == 400 || f.code == 404) return nError('По указанному ID не был найден бот.');
      return JSON.stringify(f);
  }

  /**
  * setAutoPost
  * @param client_id(Number | String) - Bot's id
  * @param guilds_amount(Number) - Guilds amount
  * @param interval(Number = 1800000(30min)) - The statistics send interval in ms
  */
  async setAutoPost(client_id, guilds_amount, interval = 1800000) {
    // За основу взял изменения из запроса @CatInChair
    if(!client) return nError('Вы не указали константу клиента!')

    if(interval && interval < 900000) return nError("Отправка статистики возможна не менее одного раза в 15 минут!");
    if(!guild_amount instanceof Number && !Number(guild_amount)) return nError("Кол-во гильдий должно быть представлено численным значением");
    await this._setStats(client_id, guild_amount);
    return setInterval(this._setStats, interval, client_id, guilds_amount);
  };
  async _setStats(clientID, guilds_amount) {
    let s = await (await fetch(`${base_url}/api/auth/stats/${clientID}`, { method: 'POST', body: JSON.stringify({ servers: guilds_amount }), headers: { 'Content-Type': 'application/json', 'Authorization': this.token}, })).json();
    if(s.success == 'false') return nError('Ошибка отправки статистики! ' + s.error);
    if(s.success == 'true') return nLogWPT(' Статистика успешно отправлена на API Moonbots! ' + JSON.stringify(s))
  }
  };