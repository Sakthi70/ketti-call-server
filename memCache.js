class MemCache {

    static hset(set, key, val) {
      if (!this.memCache[set]) {
        this.memCache[set] = {};
      }
      this.memCache[set][key] = val;
    }
  
    static hget(set, key) {
      let val = null;
      if (this.memCache[set] && this.memCache[set][key]) {
        val = this.memCache[set][key];
      }
      return val;
    }
  
    static hdel(set, key) {
      if (this.memCache[set] && this.memCache[set][key]) {
        delete this.memCache[set][key];
      }
    }
  
    static memCache = {};
  }

  module.exports = {MemCache}