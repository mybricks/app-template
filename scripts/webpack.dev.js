const path = require('path')

const ignoreWarningPlugin = require('./ignoreWarningPlugin')
const webpack = require('webpack')
const WebpackBar = require('webpackbar');

const outputPath = path.resolve(__dirname, `../_assets`)
const myBricksAlias = require('../../designer-spa/_scripts/mybricks-designer-alias')

module.exports = {
  mode: 'development',
  entry: {
    index: path.resolve(__dirname, `../src/index.tsx`),
    preview: path.resolve(__dirname, `../src/preview.tsx`)
  },
  output: {
    path: outputPath,
    filename: './[name].js',
    libraryTarget: 'umd',
    library: '[name]'
  },
  resolve: {
    alias: Object.assign({
      '@mybricks/render-web': path.join(__dirname, '../../render-web/src/index.tsx'),
      '@mybricks/render-com': path.join(__dirname, '../../render-com/src/index.tsx'),
      '@mybricks/sdk-for-app/ui': path.join(__dirname, '../../sdk-for-app/src/ui/index.ts'),
      '@mybricks/sdk-for-app/api': path.join(__dirname, '../../sdk-for-app/src/api/index.ts'),
    }, myBricksAlias),
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  externals: [{
    'react': {
      commonjs: "react",
      commonjs2: "react",
      amd: "react",
      root: "React"
    },
    'react-dom': {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "react-dom",
      root: "ReactDOM"
    },
    moment: 'moment',
    'antd': {
      commonjs: 'antd',
      commonjs2: 'antd',
      amd: 'antd',
      root: "antd"
    },
    '@ant-design/icons': 'icons'
  }],
  devtool: 'cheap-source-map',//devtool: 'cheap-source-map',
  // resolve: {
  //     alias: {
  //         '@es/spa-designer': require('path').resolve(__dirname, '../'),
  //     }
  // },
  devServer: {
    static: {
      directory: outputPath,
    },
    port: 8002,
    host: '0.0.0.0',
    // compress: true,
    // hot: true,
    client: {
      logging: 'warn',
      // overlay: true,
      // progress: true,
    },
    // open:true,
    proxy: []
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-react'
              ],
              plugins: [
                ['@babel/plugin-proposal-class-properties', {'loose': true}]
              ],
              cacheDirectory: true
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        //include: [pathSrc, testSrc],
        use: [
          // {
          //   loader: './config/test-loader'
          // },
          {
            loader: 'ts-loader',
            options: {
              silent: true,
              transpileOnly: true,
              compilerOptions: {
                module: 'es6',
                target: 'es6'
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        // exclude: /node_modules/,
        use: ['style-loader', 'css-loader']
      },
      // {
      //   test: /\.nmd(?=\.less)$/gi,
      //   use: ['style-loader', 'css-loader', 'less-loader']
      // },
      {
        test: /\.lazy.less$/i,
        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: "lazyStyleTag",
              insert: function insertIntoTarget(element, options) {
                (options.target || document.head).appendChild(element)
              },
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]-[hash:5]'
              }
            }
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              }
            }
          }
        ]
      },
      {
        test: /^[^\.]+\.less$/i,
        use: [
          {
            loader: 'style-loader',
            options: {injectType: "singletonStyleTag"},
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]-[hash:5]'
              }
            }
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              }
            },
          }
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 100Kb
              limit: 1024 * 100,
              name: 'img_[name]_[contenthash:4].[ext]'
            }
          }
        ]
      },
      // {
      //   test: /\.(gif|png|jpe?g|svg)$/i,
      //   use: [
      //     'file-loader',
      //     {
      //       loader: 'image-webpack-loader',
      //       options: {
      //         mozjpeg: {
      //           progressive: true,
      //         },
      //         // optipng.enabled: false will disable optipng
      //         optipng: {
      //           enabled: false,
      //         },
      //         pngquant: {
      //           quality: [0.65, 0.90],
      //           speed: 4
      //         },
      //         gifsicle: {
      //           interlaced: false,
      //         },
      //         // the webp option will enable WEBP
      //         webp: {
      //           quality: 75
      //         }
      //       }
      //     },
      //   ],
      // },
      // {
      //   test: /\.svg$/i,
      //   use: [
      //     {loader: 'raw-loader'}
      //   ]
      // },
      // {
      //   test: /\.vue$/i,
      //   use: [
      //     {loader: 'vue-loader'}
      //   ]
      // },
      {
        test: /\.d.ts$/i,
        use: [
          {loader: 'raw-loader'}
        ]
      },
      {
        test: /\.(xml|txt|html|cjs|theme)$/i,
        use: [
          {loader: 'raw-loader'}
        ]
      }
    ]
  },
  optimization: {
    concatenateModules: false//name_name
  },
  plugins: [
    new WebpackBar(),
    new ignoreWarningPlugin(),   // All warnings will be ignored
    new webpack.DefinePlugin({
      ENV: JSON.stringify("DEV")
    })
  ]

}