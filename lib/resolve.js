const {satisfies} = require('semver');
const {flatMap} = require('lodash');
const topoSort = require('toposort');
const hints = require('./hints');

const resolveHint = (packageName, resolveVersion) => {
    const version = resolveVersion(packageName);
    const config = hints.filter(h => h.name === packageName).find(h => satisfies(version, h.range));
    return config ? {...config, version} : [];
};

const sortImports = imports => {
    const importNames = imports.map(i => i.name);
    const edges = flatMap(
        imports,
        ({name, requires = []}) => requires.map(dependency => [dependency, name])
    );
    const sortedNames = topoSort.array(importNames, edges);
    const nameIndex = sortedNames.reduce((output, name, i) => ({...output, [name]: i}), {});
    return imports.sort((x, y) => nameIndex[x.name] - nameIndex[y.name]);
};

module.exports = (dependencies, omits, resolveVersion) => {
    const hints = flatMap(dependencies, name => resolveHint(name, resolveVersion)).filter(h => !omits.has(h.name));
    // Remove those already defined in `externals`
    // Mark packages being overrided:
    //
    // {
    //     "react-router": {
    //         ...those in react-router-dom
    //     }
    // }
    const overrides = hints.reduce(
        (overrides, hint) => {
            const hintOverrides = hint.overrides || [];
            for (const name of hintOverrides) {
                overrides[name] = hint; // eslint-disable-line no-param-reassign
            }
            return overrides;
        },
        {}
    );
    const externals = hints.reduce(
        (externals, hint) => {
            const targetHint = overrides.hasOwnProperty(hint.name) ? overrides[hint.name] : hint;
            // eslint-disable-next-line no-param-reassign
            externals[hint.name] = targetHint.exports;
            return externals;
        },
        {}
    );
    const imports = hints.filter(h => !overrides.hasOwnProperty(h.name));
    return {
        externals,
        imports: sortImports(imports),
    };
};
