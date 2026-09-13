const { generatorRegistry } = require("../generators");

const runOrchestrator = async (context, outputTypes, config) => {
  const tasks = outputTypes.map(async (type) => {
    const generatorFn = generatorRegistry[type];

    if (!generatorFn) {
      return { type, content: null, error: `No generator implemented for type: ${type}` };
    }

    try {
      const content = await generatorFn({ context, config });
      return { type, content, error: null };
    } catch (err) {
      return { type, content: null, error: err.message };
    }
  });

  return Promise.all(tasks);
};

module.exports = { runOrchestrator };