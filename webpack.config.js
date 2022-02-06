const path = require('path')

const {CleanWebpackPlugin} = require('clean-webpack-plugin')

const HTMLWebpackPlugin = require('html-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssWebpackPlugin = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const filename = ext => isDev ? `[name].${ext}` : `[name].[fullhash].${ext}`
const devtool = isDev && 'eval-source-map'

module.exports = {
    entry: path.resolve(__dirname, 'src/index.tsx'),
    output: { path: path.resolve(__dirname, 'dist'), filename: filename('js')},

    devtool,
    optimization: optimization(),
    devServer: {port: 3000, hot: true},
    resolve: { extensions: ['.tsx', '.ts', '.js'] },

    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssWebpackPlugin({filename: filename('css')}),
        new HTMLWebpackPlugin({template: path.resolve(__dirname, 'src/index.html')})
    ],

    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.(s[ac]|c)ss$/,
                use: cssLoaders('sass-loader') 
            },
            {
                test: /\.[jt]sx?$/, 
                loader: 'babel-loader', 
                exclude: /node_modules/, 
            }, 
            {
                test: /\.(png|svg|jpg|gif|jpeg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                }
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: 'file-loader'
            },
        ]
    }

}


function optimization() {
    const config = {
      splitChunks: {
        chunks: 'all'
      }
    }
  
    if (isProd) {
      config.minimizer = [
        new CssMinimizerPlugin(),
        new TerserWebpackPlugin()
      ]
    }
  
    return config
}

function cssLoaders(loader) {
    
    const cssload = isDev ? 'style-loader' : MiniCssWebpackPlugin.loader

    const loaders = [ cssload , 'css-loader', 'postcss-loader']

    if(loader) loaders.push(loader)

    return  loaders
}
