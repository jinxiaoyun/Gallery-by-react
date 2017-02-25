var path = require('path');
var fs = require('fs');
var del = require('del');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var minifycss = require('gulp-minify-css');
var gulpOpen = require('gulp-open');
var group = require('gulp-group-files');
var rev = require('gulp-rev-append');
var cssver = require('gulp-make-css-url-version');
var base64 = require('gulp-base64');
var fileinclude = require('gulp-file-include');
var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var connect = require('gulp-connect');
var livereload = require('gulp-livereload');

var environment = $.util.env.type || 'development';
var isProduction = environment === 'production';

var webpack = require('webpack');

var webpackConfig = require('./webpack.config.js').getConfig(environment);
//console.log(webpackConfig)

var port = $.util.env.port || 8000;
var dev = 'src/';
var dist = 'dist/';

var autoprefixerBrowsers = [
    'ie >= 7',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 6',
    'opera >= 23',
    'ios >= 6',
    'android >= 4.4',
    'bb >= 10'
];



gulp.task('scripts', function () {


    var entrys = webpackConfig.entry;

    for(var obj in entrys){
        gulp.src(entrys[obj])
        .pipe($.webpack(webpackConfig))
            .pipe(isProduction ? $.uglify() : $.util.noop())
            .pipe(gulp.dest(dist + 'js/'))
            .pipe(connect.reload())
            .pipe(livereload());
        return ;
    }

});



function getSrcCss() {
    var srcDir = path.resolve(process.cwd(), 'src');
    var srcCss = path.resolve(srcDir, 'css');
    var dirs = fs.readdirSync(srcCss);
    var matchs = [],
        files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.scss$/);
        if (matchs) {
            files[matchs[1]] = path.resolve(srcDir, 'css', item);
        }
    });
    return files;
}

gulp.task('styles',['images'], function (cb) {
    var files = getSrcCss();
    //console.log(files);

    return group(files, function (key, fileset) {
        //console.log(fileset);
        return gulp.src(fileset)
            .pipe($.sass({outputStyle: 'expanded'}))
            .pipe($.autoprefixer({browsers: autoprefixerBrowsers}))
            .pipe(isProduction ? minifycss() : $.util.noop())
            .pipe(gulp.dest(dist + 'css/'))
            .pipe(cssver())
            .pipe(gulp.dest(dist + 'css/'))
            .pipe(connect.reload())
            .pipe(livereload())

    })();


});

gulp.task('images', function (cb) {
    return gulp.src(dev + 'images/**/*.{png,jpg,jpeg,gif,json}')
        .pipe($.cache(imagemin({
            progressive:true,
            use:[imageminPngquant({
                quality:'70-80'
            })]
        })))
        .pipe(gulp.dest(dist + 'images/'));
});

gulp.task('base64',['styles'],function(){
    var config = {
        src: dist + 'css/*.css',
        dest:dist + 'css'
    };
    return gulp.src(config.src)
        .pipe(base64({maxImageSize:8*1024}))
        .pipe(gulp.dest(config.dest))
});

gulp.task('html',['base64'], function () {
    return gulp.src(dev + '*.html')
        .pipe(fileinclude({       
            prefix:'@@',
            basepath:'@file'
        }))          
        .pipe(gulp.dest(dist))
        .pipe(rev())
        .pipe(gulp.dest(dist))
        .pipe(connect.reload())   
        .pipe(livereload())
   

});

gulp.task('serve', function () {

    connect.server({
        root: 'dist',
        port: port,
        livereload: true

    });

});

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(dev + 'css/**/*.scss', ['base64']);
    gulp.watch(dev + '**/*.html', ['html']);
    gulp.watch(dev + 'scripts/**/*.{js,jsx}', ['scripts']);
    gulp.watch(dev + 'images/**/*.{png,jpg,jpeg,gif}',['images']);
});

gulp.task('clean', function (cb) {
    return del([dist], cb);
});

gulp.task('open',['serve'], function () {
    return gulp.src("")
        .pipe(gulpOpen({
            uri: 'http://localhost:' + port + '/index.html'
        }));
});

gulp.task("help",function () {
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("+	gulp dev			     文件监控打包,开发环境							+");
    console.log("+	gulp 			         文件打包,js,css不压缩						+");
    console.log("+	gulp --type production	 文件线上打包	,压缩js,css文件					+");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
});

gulp.task('dev',['open','watch']);


gulp.task('default',['clean','scripts'],function(){
    gulp.start(['html']);
});

