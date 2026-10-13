module.exports = [
"[turbopack-node]/transforms/postcss.ts?config=[project]/artifacts/coffeepass/postcss.config.mjs { CONFIG => \"[project]/artifacts/coffeepass/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/node_modules__pnpm_1602ovmuzuqd4._.js",
  "chunks/[root-of-the-server]__1aacs6pc_5hhd._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts?config=[project]/artifacts/coffeepass/postcss.config.mjs { CONFIG => \"[project]/artifacts/coffeepass/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];