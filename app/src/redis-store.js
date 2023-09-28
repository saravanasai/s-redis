class RedisStore {
  constructor() {
    this.hashMap = new Map();
  }

  set(key, value, ttl = 0) {
    let isInserted = this.hashMap.set(`${key}`, value);

    if (isInserted && ttl) {
      setTimeout(() => {
        this.remove(key);
      }, ttl);
    }
    return;
  }

  get(key) {
    if (this.hashMap.has(`${key}`)) {
      return this.hashMap.get(`${key}`);
    }
    return "-1";
  }

  remove(key) {
    return this.hashMap.delete(`${key}`);
  }
}

module.exports = {
  RedisStore,
};
