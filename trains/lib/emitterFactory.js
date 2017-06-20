const EventEmitter = require('events');
class myEmitter extends EventEmitter{};
let emitter = undefined;
module.exports = function () {
  if(emitter){
    return emitter;
  }
  emitter = new myEmitter();
  emitter.setMaxListeners(50);
  return emitter;
}
