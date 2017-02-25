var path = require('path');
var fs = require('fs');

module.exports.getConfig = function(type) {

  var isDev = type === 'development';

  var srcDir = path.resolve(process.cwd(),'src');
  //获取多页面的第个入口js文件
  function getEntry(){
    var jsPath = path.resolve(srcDir,'scripts');
    var dirs = fs.readdirSync(jsPath);

    var matchs = [],
        files = {};
    dirs.forEach(function(item){
      matchs = item.match(/(.+)\.js$/);
      if(matchs){
        files[matchs[1]] = path.resolve(srcDir,'scripts',item);
      }
    });
    return files;
  }

  var config = {

    entry:getEntry(),

    output: {
      path: path.join(__dirname ,'dist/js/' ),
      filename: '[name].js'
    },
    debug : isDev,
    module: {
      loaders: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json-loader'
      }]
    },
    resolve: {
      modulesDirectories: ['node_modules'],
      fallback: path.join(__dirname, 'node_modules')
    },
    resolveLoader: {
      fallback: path.join(__dirname, 'node_modules')
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM'
    }

  };

  if(isDev){
    config.devtool = 'eval';
  }

  return config;
};