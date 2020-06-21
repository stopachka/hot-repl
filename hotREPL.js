function patchRequire() {
  const originalRequire = require.extensions[".js"];

  require.extensions[".js"] = function (mod, filename) {
    originalRequire(mod, filename);

    function latestExports() {
      const latestMod = require.cache[filename] || mod;
      return latestMod.exports["__ORIGINAL_EXPORTS_K"] || latestMod.exports;
    }

    const originalExports = mod.exports;
    /**
     * Setting the proxy child as function () {},
     * so we allow the developer to change their export type.
     * If they go from {} to () => and vice versa, this will still work
     */
    mod.exports = new Proxy(function () {}, {
      apply(_target, _thisArg, args) {
        return latestExports()(...args);
      },
      get(_target, prop, receiver) {
        /**
         * We need a way to access the actual export, to avoid
         * infinite stack frames.
         *
         * This feels brittle. Very least we can use a symbol,
         * or we could rethink how we can grab the original export
         */
        if (prop === "__ORIGINAL_EXPORTS_K") {
          return originalExports;
        }
        return latestExports()[prop];
      },
      __ORIGINAL_EXPORTS_K: originalExports,
    });
  };
  console.log("🔥 require ready to go!");
}

/**
 * This implementation has a lot to be desired.
 * Mainly, if you update a child module, it won't bust the cache for parent modules
 *
 * Ideally we would build a dependency graph of all affected modules, and re-load them
 */
function reload(requirePath) {
  const path = require.resolve(requirePath);
  const mod = require.cache[path];
  if (mod) {
    mod.children &&
      mod.children.forEach((childMod) => reload(childMod.filename));
    delete require.cache[path];
  }
  require(requirePath);
}

module.exports = {
  patchRequire,
  reload,
};
