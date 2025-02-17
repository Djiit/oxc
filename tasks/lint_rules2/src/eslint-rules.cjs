const { Linter } = require("eslint");

// NOTICE!
// Plugins do not provide their type definitions, and also `@types/*` do not exist!
// Even worse, every plugin has slightly different types, different way of configuration in detail...
//
// So here, we need to list all rules while normalizing recommended and deprecated flags.
// - rule.meta.deprecated
// - rule.meta.docs.recommended
// Some plugins have the recommended flag in rule itself, but some plugins have it in config.

// https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/index.ts
const {
  rules: pluginTypeScriptAllRules,
  configs: pluginTypeScriptConfigs,
} = require("@typescript-eslint/eslint-plugin");
// https://github.com/eslint-community/eslint-plugin-n/blob/master/lib/index.js
const { rules: pluginNAllRules } = require("eslint-plugin-n");
// https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/index.js
const {
  rules: pluginUnicornAllRules,
  configs: pluginUnicornConfigs,
} = require("eslint-plugin-unicorn");
// https://github.com/gajus/eslint-plugin-jsdoc/blob/main/src/index.js
const {
  // @ts-expect-error: Module has no exported member
  rules: pluginJSDocAllRules,
  // @ts-expect-error: Module has no exported member
  configs: pluginJSDocConfigs,
} = require("eslint-plugin-jsdoc");
// https://github.com/import-js/eslint-plugin-import/blob/main/src/index.js
const {
  rules: pluginImportAllRules,
  configs: pluginImportConfigs,
} = require("eslint-plugin-import");
// https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/src/index.js
const {
  rules: pluginJSXA11yAllRules,
  configs: pluginJSXA11yConfigs,
} = require("eslint-plugin-jsx-a11y");
// https://github.com/jest-community/eslint-plugin-jest/blob/main/src/index.ts
const { rules: pluginJestAllRules } = require("eslint-plugin-jest");
// https://github.com/jsx-eslint/eslint-plugin-react/blob/master/index.js
const { rules: pluginReactAllRules } = require("eslint-plugin-react");
// https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/src/index.js
const {
  rules: pluginReactHooksAllRules,
} = require("eslint-plugin-react-hooks");
// https://github.com/cvazac/eslint-plugin-react-perf/blob/master/index.js
const {
  rules: pluginReactPerfAllRules,
  configs: pluginReactPerfConfigs,
} = require("eslint-plugin-react-perf");
// https://github.com/vercel/next.js/blob/canary/packages/eslint-plugin-next/src/index.ts
const { rules: pluginNextAllRules } = require("@next/eslint-plugin-next");

// All rules(including deprecated, recommended) are loaded initially.
exports.createESLintLinter = () => new Linter();

/** @param {import("eslint").Linter} linter */
exports.loadPluginTypeScriptRules = (linter) => {
  // We want to list all rules but not support type-checked rules
  const pluginTypeScriptDisableTypeCheckedRules = new Map(
    Object.entries(pluginTypeScriptConfigs["disable-type-checked"].rules),
  );
  for (const [name, rule] of Object.entries(pluginTypeScriptAllRules)) {
    if (
      pluginTypeScriptDisableTypeCheckedRules.has(`@typescript-eslint/${name}`)
    )
      continue;

    const prefixedName = `typescript/${name}`;

    linter.defineRule(prefixedName, rule);
  }
};

/** @param {import("eslint").Linter} linter */
exports.loadPluginNRules = (linter) => {
  for (const [name, rule] of Object.entries(pluginNAllRules)) {
    const prefixedName = `n/${name}`;

    // @ts-expect-error: The types of 'meta.fixable', 'null' is not assignable to type '"code" | "whitespace" | undefined'.
    linter.defineRule(prefixedName, rule);
  }
};

/** @param {import("eslint").Linter} linter */
exports.loadPluginUnicornRules = (linter) => {
  const pluginUnicornRecommendedRules = new Map(
    Object.entries(pluginUnicornConfigs.recommended.rules),
  );
  for (const [name, rule] of Object.entries(pluginUnicornAllRules)) {
    const prefixedName = `unicorn/${name}`;

    // If name is presented and value is not "off", it is recommended
    const recommendedValue = pluginUnicornRecommendedRules.get(prefixedName);
    // @ts-expect-error: `rule.meta.docs` is possibly `undefined`
    rule.meta.docs.recommended = recommendedValue && recommendedValue !== "off";

    linter.defineRule(prefixedName, rule);
  }
};

/** @param {import("eslint").Linter} linter */
exports.loadPluginJSDocRules = (linter) => {
  const pluginJSDocRecommendedRules = new Map(
    Object.entries(pluginJSDocConfigs.recommended.rules),
  );
  for (const [name, rule] of Object.entries(pluginJSDocAllRules)) {
    const prefixedName = `jsdoc/${name}`;

    // If name is presented and value is not "off", it is recommended
    const recommendedValue = pluginJSDocRecommendedRules.get(prefixedName);
    rule.meta.docs.recommended = recommendedValue && recommendedValue !== "off";

    linter.defineRule(prefixedName, rule);
  }
};

/** @param {import("eslint").Linter} linter */
exports.loadPluginImportRules = (linter) => {
  const pluginImportRecommendedRules = new Map(
    // @ts-expect-error: Property 'rules' does not exist on type 'Object'.
    Object.entries(pluginImportConfigs.recommended.rules),
  );
  for (const [name, rule] of Object.entries(pluginImportAllRules)) {
    const prefixedName = `import/${name}`;

    // @ts-expect-error: Property 'recommended' does not exist on type
    rule.meta.docs.recommended = pluginImportRecommendedRules.has(prefixedName);

    // @ts-expect-error: The types of 'meta.type', 'string' is not assignable to type '"problem" | "suggestion" | "layout" | undefined'.
    linter.defineRule(prefixedName, rule);
  }
};

/** @param {import("eslint").Linter} linter */
exports.loadPluginJSXA11yRules = (linter) => {
  const pluginJSXA11yRecommendedRules = new Map(
    Object.entries(pluginJSXA11yConfigs.recommended.rules),
  );
  for (const [name, rule] of Object.entries(pluginJSXA11yAllRules)) {
    const prefixedName = `jsx-a11y/${name}`;

    const recommendedValue = pluginJSXA11yRecommendedRules.get(prefixedName);
    rule.meta.docs.recommended =
      recommendedValue &&
      // Type is `string | [string, opt]`
      recommendedValue !== "off" &&
      recommendedValue[0] !== "off";

    linter.defineRule(prefixedName, rule);
  }
};

/** @param {import("eslint").Linter} linter */
exports.loadPluginJestRules = (linter) => {
  for (const [name, rule] of Object.entries(pluginJestAllRules)) {
    const prefixedName = `jest/${name}`;

    // Presented but type is `string | false`
    rule.meta.docs.recommended = typeof rule.meta.docs.recommended === "string";

    linter.defineRule(prefixedName, rule);
  }
};

/** @param {import("eslint").Linter} linter */
exports.loadPluginReactRules = (linter) => {
  for (const [name, rule] of Object.entries(pluginReactAllRules)) {
    const prefixedName = `react/${name}`;

    linter.defineRule(prefixedName, rule);
  }
};

/** @param {import("eslint").Linter} linter */
exports.loadPluginReactHooksRules = (linter) => {
  for (const [name, rule] of Object.entries(pluginReactHooksAllRules)) {
    const prefixedName = `react-hooks/${name}`;

    // @ts-expect-error: The types of 'meta.type', 'string' is not assignable to type '"problem" | "suggestion" | "layout" | undefined'.
    linter.defineRule(prefixedName, rule);
  }
};

/** @param {import("eslint").Linter} linter */
exports.loadPluginReactPerfRules = (linter) => {
  const pluginReactPerfRecommendedRules = new Map(
    Object.entries(pluginReactPerfConfigs.recommended.rules),
  );
  for (const [name, rule] of Object.entries(pluginReactPerfAllRules)) {
    const prefixedName = `react-perf/${name}`;

    rule.meta.docs.recommended =
      pluginReactPerfRecommendedRules.has(prefixedName);

    linter.defineRule(prefixedName, rule);
  }
};

/** @param {import("eslint").Linter} linter */
exports.loadPluginNextRules = (linter) => {
  for (const [name, rule] of Object.entries(pluginNextAllRules)) {
    const prefixedName = `nextjs/${name}`;

    linter.defineRule(prefixedName, rule);
  }
};
