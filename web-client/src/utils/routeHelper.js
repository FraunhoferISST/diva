export default (id, postfix = "") => {
  switch (true) {
    case id.startsWith("asset"):
      return `/assets/${id}${postfix}`;
    case id.startsWith("resource"):
      return `/resources/${id}${postfix}`;
    case id.startsWith("user"):
      return `/users/${id}${postfix}`;
    case id.startsWith("publisher"):
      return `/publishers/${id}${postfix}`;
    case id.startsWith("destroyclaim"):
      return `/destroyclaims/${id}${postfix}`;
    default:
      return `/entities/${id}${postfix}`;
  }
};
