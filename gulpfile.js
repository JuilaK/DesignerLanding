'use strict';

const {src, dest, watch, parallel, series} = require('gulp');
const webpackStream = require('webpack-stream');
const browserSync = require('browser-sync').create();
const del = require("del");
const rename = require("gulp-rename");
const notify = require('gulp-notify');
const fileinclude = require('gulp-file-include');
const scss = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require("gulp-cssnano");
const uglify = require('gulp-uglify-es').default;
const svgSprite = require('gulp-svg-sprite');
const imagemin = require("gulp-imagemin");

/* Paths */
const srcPath = 'src/';
const distPath = 'dist/';

const path = {
    build: {
        html:   distPath,
        js:     distPath + "assets/js/",
        css:    distPath + "assets/css/",
        images: distPath + "assets/images/",
        fonts:  distPath + "assets/fonts/"
    },
    src: {
        html:   srcPath + "*.html",
        js:     srcPath + "assets/js/*.js",
        css:    srcPath + "assets/scss/*.scss",
        images: srcPath + "assets/images/**/*.{jpg,png,gif,ico,webp,webmanifest,xml,json}",
        svg:    srcPath + "assets/images/**/*.svg",
        fonts:  srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}"
    },
    watch: {
        html:   srcPath + "**/*.html",
        js:     srcPath + "assets/js/**/*.js",
        css:    srcPath + "assets/scss/**/*.scss",
        images: srcPath + "assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
        svg:    srcPath + "assets/images/**/*.svg",
        fonts:  srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}"
    },
    clean: "./" + distPath
}

/* Tasks */

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "./" + distPath
        }
    });
}

function html() {
    return src(path.src.html, {base: srcPath})
        .pipe(fileinclude({
            prefix: '@',
            basepath: '@file'
        }))
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream())
}

function css() {
    return src(path.src.css, {base: srcPath + "assets/scss/"})
        .pipe(scss({
            outputStyle: 'compressed'
        }).on('error', notify.onError()))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 version'],
            grid: true }))
        .pipe(cssnano({
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(dest(path.build.css))
        .pipe(browserSync.stream())
}

function cssWatch() {
    return src(path.src.css, {base: srcPath + "assets/scss/"})
        .pipe(scss({
            outputStyle: 'compressed'
        }).on('error', notify.onError()))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(dest(path.build.css))
        .pipe(browserSync.stream())
}

function js() {
    return src(path.src.js, {base: srcPath + 'assets/js/'})
        .pipe(webpackStream({
            mode: "production",
            output: {
            filename: 'script.js',
            },
            module: {
            rules: [
                {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
                }
            ]
            }
        }))
        .on('error', function (err) {
            console.error('WEBPACK ERROR', err);
            this.emit('end'); // Don't stop the rest of the task
        })
		.pipe(uglify().on("error", notify.onError()))
		.pipe(dest(path.build.js))
        .pipe(browserSync.stream())
}

function jsWatch() {
    return src(path.src.js, {base: srcPath + 'assets/js/'})
        .pipe(webpackStream({
            mode: "development",
            output: {
                filename: 'script.js',
            }
        }))
		.pipe(dest(path.build.js))
        .pipe(browserSync.stream())
}

const svg = () => {
	return src(path.src.svg)
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../sprite.svg"
				}
			}
		}))
		.pipe(dest(path.build.images))
}

function images() {
    return src(path.src.images)
		.pipe(dest(path.build.images))
        .pipe(browserSync.stream());
}

function fonts() {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts))
        .pipe(browserSync.reload({stream: true}))
        .pipe(browserSync.stream());
}

function clean() {
    return del(path.clean);
}

function watchFiles() {
    watch([path.watch.html], html);
    watch([path.watch.css], cssWatch);
    watch([path.watch.js], jsWatch);
    watch([path.watch.images], images);
    watch([path.watch.svg], svg);
    watch([path.watch.fonts], fonts);
}

const build = series(clean, parallel(html, css, js, images, svg, fonts));
const watchAll = parallel(build, watchFiles, browsersync);

/* Exports Tasks */
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.svg = svg;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.watch = watchAll;
exports.default = watchAll;