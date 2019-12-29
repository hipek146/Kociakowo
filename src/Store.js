class Store {
  constructor() {
    this.store = {
      target: "/",
      update: []
    };
  }
  navigate = (target, push = true) => {
    this.store.target = target;
    this.store.push = push;
    this.update();
  };
  subscribeAlert = target => {
    this.store.updateAlert = target;
  };
  alert = (text, color) => {
    if (this.store.updateAlert) this.store.updateAlert.update(text, color);
  };
  set = (param, value) => {
    this.store[param] = value;
    this.update();
  };
  update = () => {
    this.store.update.forEach(element => element.forceUpdate());
  };
  subscribe = target => {
    this.store.update.push(target);
  };
  unsubscribe = target => {
    var array = this.store.update;
    for (let i = array.length - 1; i >= 0; i--) {
      if (array[i] === target) {
        this.store.update.splice(i, 1);
      }
    }
  };
  get = () => {
    return this.store;
  };
}
export const store = new Store();
