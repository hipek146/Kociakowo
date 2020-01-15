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
  alert = (text, color, index = 1) => {
    if (this.store.updateAlert)
      this.store.updateAlert.update(text, color, index);
  };
  set = (param, value) => {
    if (!Array.isArray(param)) {
      param = Array.of(param);
      value = Array.of(value);
    }
    param.forEach((element, index) => {
      this.store[element] = value[index];
    });
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
