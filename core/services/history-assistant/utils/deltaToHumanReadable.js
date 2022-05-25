const _ = require("lodash");

const IGNORE_FIELDS = (process.env.IGNORE_FIELDS &&
  JSON.parse(process.env.IGNORE_FIELDS)) || ["modifiedAt"];

/* Rule Checker */
const isAddedValue = (v) => _.isArray(v) && v.length === 1;
const isModifiedValue = (v) => _.isArray(v) && v.length === 2;
const isDeletedValue = (v) =>
  _.isArray(v) && v.length === 3 && v[1] === 0 && v[2] === 0;
const isObjectInnerChange = (v) => _.isObject(v) && _.isUndefined(v._t);
const isArrayInnerChange = (v) => _.isObject(v) && !_.isUndefined(v._t);
const isScalar = (v) => _.isString(v) || _.isNumber(v) || _.isBoolean(v);
const isObject = (v) => _.isObject(v) && !_.isArray(v);

const objectToReadable = (v) => v;

const arrayToReadable = (v) => v;

const buildKey = (parent, child) => {
  if (parent === "") {
    return child;
  }

  return `${parent}.${child}`;
};

const cleanKey = (k) => {
  if (k.indexOf(".") !== -1) {
    const splittedKey = k.split(".");
    const lastElement = splittedKey[splittedKey.length - 1];
    const regex = /^(_)?\d+$/gm;
    const match = regex.exec(lastElement);

    if (match !== null) {
      return k.slice(0, k.lastIndexOf("."));
    }
  }

  return k;
};

const deltaToHumanReadable = (delta, parentKey = "") => {
  const human = [];

  // eslint-disable-next-line guard-for-in
  for (const key in delta) {
    const value = delta[key];
    const res = {};

    if (!IGNORE_FIELDS.includes(key)) {
      if (isAddedValue(value)) {
        res.action = "added";
        res.property = cleanKey(buildKey(parentKey, key));

        if (isScalar(value[0])) {
          // eslint-disable-next-line prefer-destructuring
          res.value = value[0];
        }
        if (_.isArray(value[0])) {
          res.value = arrayToReadable(value[0]);
        }
        if (isObject(value[0])) {
          res.value = objectToReadable(value[0]);
        }

        human.push(res);
      }

      if (isModifiedValue(value)) {
        res.action = "modified";
        res.property = cleanKey(buildKey(parentKey, key));
        const [from, to] = value;
        res.from = from;
        res.to = to;
        if (isScalar(value[0])) {
          // eslint-disable-next-line prefer-destructuring
          res.from = from;
        }
        if (_.isArray(value[0])) {
          res.from = arrayToReadable(from);
        }
        if (isObject(value[0])) {
          res.from = objectToReadable(from);
        }

        if (isScalar(to)) {
          // eslint-disable-next-line prefer-destructuring
          res.to = to;
        }
        if (_.isArray(to)) {
          res.to = arrayToReadable(to);
        }
        if (isObject(to)) {
          res.to = objectToReadable(to);
        }

        human.push(res);
      }

      if (isDeletedValue(value)) {
        res.action = "deleted";
        res.property = cleanKey(buildKey(parentKey, key));

        if (isScalar(value[0])) {
          // eslint-disable-next-line prefer-destructuring
          res.value = value[0];
        }
        if (_.isArray(value[0])) {
          res.value = arrayToReadable(value[0]);
        }
        if (isObject(value[0])) {
          res.value = objectToReadable(value[0]);
        }

        human.push(res);
      }

      if (isArrayInnerChange(value)) {
        const nestedHuman = deltaToHumanReadable(value, key);
        human.push(...nestedHuman);
      }

      if (isObjectInnerChange(value)) {
        const nestedHuman = deltaToHumanReadable(value, key);
        human.push(...nestedHuman);
      }
    }
  }
  return human;
};

module.exports = {
  deltaToHumanReadable,
};
