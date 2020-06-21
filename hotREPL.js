function patchRequire() {
  const originalRequire = require.extensions[".js"];

  require.extensions[".js"] = function (mod, filename) {
    originalRequire(mod, filename);

    function latestExports() {
      const latestMod = require.cache[filename] || mod;
      return latestMod.exports["__ORIGINAL_EXPORTS_K"] || latestMod.exports;
    }

    const originalExports = mod.exports;
    mod.exports = new Proxy(function () {}, {
      apply(_target, _thisArg, args) {
        return latestExports()(...args);
      },
      get(_target, prop, receiver) {
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
