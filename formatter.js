var MessageFormat = require('message-format');

function Formatter(dict) {
    this.dict = dict;
}

Formatter.prototype.format = function format(message, args) {
    if (!this.dict[message]) {
        console.warn('no translation found for', message);
    }

    message = this.dict[message] || message;

    return new MessageFormat(message).format(args);
}

module.exports = Formatter;
