/**
 * Created by porfirio.chavez on 23/06/17.
 */
module.exports = {
    entry: './main',
    output: { filename: 'app.js' },
    module: {
        rules: [
            {
                test: /.ts$/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    }
};
