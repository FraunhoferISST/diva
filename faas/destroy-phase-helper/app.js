const analyze = async () => {
  console.log("Hello Destroy Phase!");
  return true;
};

analyze()
  .then(() => console.log("success"))
  .catch((e) => console.error(e));
