const {isPlainObject} = require('lodash');
const resolveConfiguration = require('./lib/resolve');

const DEFAULT_OPTIONS = {
    cwd: process.cwd(),
};

const toCDN = (name, version, entry) => `https://code.bdstatic.com/npm/${name}@${version}/${entry}`;

const toScriptTag = (name, version, entry) => {
    return {
        tagName: 'script',
        voidTag: false,
        attributes: {
            src: toCDN(name, version, entry),
        },
    };
};

const findHtmlWebpackPlugin = compilation => {
    const isResolved = plugin => plugin.constructor && plugin.constructor.name === 'HtmlWebpackPlugin';
    const instance = compilation.options.plugins.find(isResolved);
    return instance ? instance.constructor : null;
};

module.exports = class InlineOwnPlugin {
    constructor(options) {
        this.urls = [];
        this.options = {
            ...DEFAULT_OPTIONS,
            ...options,
        };
    }

    apply(compiler) {
        compiler.hooks.afterEnvironment.tap(
            'webpack-auto-cdn-plugin',
            () => this.resolveDependencies(compiler)
        );
        compiler.hooks.compilation.tap(
            'webpack-auto-cdn-plugin',
            compilation => this.injectScripts(compilation)
        );
    }

    resolveDependencies(compiler) {
        const externals = compiler.options.externals || {};

        if (!isPlainObject(externals)) {
            throw new Error('Webpack externals must be a plain object if it exists');
        }

        const {cwd} = this.options;
        const resolveVersion = packageName => {
            const {version} = require(require.resolve(`${packageName}/package.json`, {paths: [cwd]}));
            return version;
        };
        const {dependencies, devDependencies} = require(`${cwd}/package.json`);
        const configuration = resolveConfiguration(
            Object.keys({...devDependencies, ...dependencies}),
            new Set(Object.keys(externals)),
            resolveVersion
        );
        this.imports = configuration.imports;
        // eslint-disable-next-line no-param-reassign
        compiler.options.externals = Object.assign(externals, configuration.externals);
    }

    injectScripts(compilation) {
        const HtmlWebpackPlugin = findHtmlWebpackPlugin(compilation);

        if (!HtmlWebpackPlugin) {
            throw new Error('No html-webpack-plugin instance found');
        }

        const {alterAssetTags} = HtmlWebpackPlugin.getHooks(compilation);
        alterAssetTags.tapAsync(
            'html-webpack-inline-source-plugin',
            (data, callback) => {
                const newData = this.addExtraScripts(data);
                callback(null, newData);
            }
        );
    }

    addExtraScripts(data) {
        const tags = this.imports.reduce(
            (tags, item) => {
                const entries = [].concat(item.entry);
                const scripts = entries.map(entry => toScriptTag(item.name, item.version, entry));
                tags.push(...scripts);
                return tags;
            },
            []
        );
        return {
            ...data,
            assetTags: {
                ...data.assetTags,
                scripts: [...tags, ...data.assetTags.scripts],
            },
        };
    }
};
