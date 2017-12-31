const listenerList = {};
class FilesEventManager {
  addEventListener(type, handler) {
    if (listenerList[type] === undefined) {
      listenerList[type] = [];
    }
    listenerList[type].push(handler);
  }
  removeEventListener(type, handler) {}
  trigger(type, data) {
    if (listenerList[type]) {
      listenerList[type].map(handler => handler(data));
    }
  }
}
const eventManager = new FilesEventManager();
module.exports = eventManager;
