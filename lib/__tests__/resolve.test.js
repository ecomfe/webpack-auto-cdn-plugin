const resolve = require('../resolve');

const resolveVersion = (() => {
    const versions = {
        react: '16.8.4',
        'react-router': '5.0.1',
        'react-router-dom': '5.0.1',
    };
    return name => versions[name];
})();

const emptySet = new Set();

describe('resolve', () => {
    it('should add a dependency to externals', () => {
        const {externals} = resolve(['react'], emptySet, resolveVersion);
        expect(externals.react).toBe('React');
    });

    it('should add an entry to imports', () => {
        const {imports} = resolve(['react'], emptySet, resolveVersion);
        expect(imports.length).toBe(1);
        expect(imports[0].name).toBe('react');
    });

    it('should use same global variable on overrides', () => {
        const {externals} = resolve(['react-router', 'react-router-dom'], emptySet, resolveVersion);
        expect(externals['react-router']).toBe('ReactRouterDOM');
        expect(externals['react-router-dom']).toBe('ReactRouterDOM');
    });

    it('should merge imports on overrides', () => {
        const {imports} = resolve(['react-router', 'react-router-dom'], emptySet, resolveVersion);
        expect(imports.length).toBe(1);
        expect(imports[0].name).toBe('react-router-dom');
    });
});
