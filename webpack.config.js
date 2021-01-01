const path = require('path')
const Config = require('webpack-chain')
// const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = new Config()

config.mode('development')

// config
//   .entry('react-dom')
//   .add('./examples/react-dom.js')

config
  .entry('component')
  .add('./examples/component.js')

config.devtool('cheap-eval-source-map')

config.module
  .rule('js')
  .test(/\.(js|mjs|jsx|ts|tsx)$/)
    .exclude.add(/node_modules/).end()
    .use('babel-loader')
      .loader(require.resolve('babel-loader'))
      .options({
        presets: [
          require.resolve('@umijs/babel-preset-umi/app.js')
        ]
      })


config.plugin('html')
  .use(require.resolve('html-webpack-plugin'), [{
    template: path.join(__dirname, 'template.html')
  }])

config.resolve.alias
  .set('react', path.join(__dirname, 'lib/react.js'))
  .set('react-dom', path.join(__dirname, 'lib/react-dom.js'))

console.log('config', JSON.stringify(config.toConfig(), null, 2))

module.exports = config.toConfig()