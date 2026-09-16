const { generatorRegistry } = require("../generators");

const runOrchestrator = async (context, outputTypes, config) => {
  const tasks = outputTypes.map(async (type) => {
    const generatorFn = generatorRegistry[type];

    if (!generatorFn) {
      return { 
        type, 
        content: null, 
        error: `No generator implemented for type: ${type}` 
      };
    }

    try {
      // Parallel Async LLM Execution
      const content = await generatorFn({ context, config });
      
      if (!content || (typeof content === "string" && content.trim() === "")) {
        return { type, content: null, error: "Generator returned empty content" };
      }

      return { type, content, error: null };
    } catch (err) {
      return { 
        type, 
        content: null, 
        error: err.message || `Failed executing generator for ${type}` 
      };
    }
  });

  // Parallel Execution Matrix
  return Promise.all(tasks);
};

module.exports = { runOrchestrator };