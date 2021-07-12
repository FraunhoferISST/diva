const capFirstCharacter = (value) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const wait = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

class Delay {
  constructor() {}
  delayTask(task, ms = 1000) {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = "";
    }
    this.timeout = setTimeout(task, ms);
  }
  cancelTask() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = "";
    }
  }
}

class Debouncer {
  constructor() {
    this.timeout = "";
  }
  debounce(task, ms = 400) {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.timeout = setTimeout(task, ms);
  }
}

// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
const isValidURL = (string) => {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i" // fragment locator
  );
  return !!pattern.test(string);
};

export { capFirstCharacter, wait, Delay, isValidURL, Debouncer };
