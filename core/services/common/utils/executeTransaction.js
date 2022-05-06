module.exports = async (operations = [], onFailure = () => {}) => {
  let operationsData = {};
  try {
    for (const op of operations) {
      const opData = await op(operationsData);
      operationsData = { ...operationsData, ...opData };
    }
    return operationsData;
  } catch (e) {
    await onFailure(operationsData);
    throw e;
  }
};
