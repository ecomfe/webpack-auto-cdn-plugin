module.exports = [
    {
        name: 'react',
        range: '16',
        entry: 'umd/react.production.min.js',
        exports: 'React',
    },
    {
        name: 'react-dom',
        range: '16',
        entry: 'umd/react-dom.production.min.js',
        exports: 'ReactDOM',
    },
    {
        name: 'prop-types',
        range: '15',
        entry: 'prop-types.min.js',
        exports: 'PropTypes',
    },
    {
        name: 'redux',
        range: '4',
        entry: 'dist/redux.min.js',
        exports: 'Redux',
    },
    {
        name: 'react-redux',
        range: '6 || 7',
        entry: 'dist/react-redux.min.js',
        exports: 'ReactRedux',
        requires: [
            'redux',
        ],
    },
    {
        name: 'react-router',
        range: '4 || 5',
        entry: 'umd/react-router.min.js',
        exports: 'ReactRouter',
    },
    {
        name: 'react-router-dom',
        range: '4 || 5',
        entry: 'umd/react-router-dom.min.js',
        exports: 'ReactRouterDOM',
        overrides: [
            'react-router',
        ],
    },
    {
        name: 'axios',
        range: '0.x',
        entry: 'dist/axios.min.js',
        exports: 'axios',
    },
    {
        name: 'echarts',
        range: '4',
        entry: 'dist/echarts.common.min.js',
        exports: 'echarts',
    },
    {
        name: 'moment',
        range: '2',
        entry: [
            'min/moment.min.js',
            'locale/zh-cn.js',
        ],
        exports: 'moment',
    },
    {
        name: 'recompose',
        range: '0.x',
        entry: 'dist/Recompose.min.js',
        exports: 'Recompose',
    },
    {
        name: 'reselect',
        range: '3 || 4',
        entry: 'dist/reselect.min.js',
        exports: 'Reselect',
    },
    {
        name: 'rxjs',
        range: '6',
        entry: 'bundles/rxjs.umd.min.js',
        exports: 'rxjs',
    },
];
