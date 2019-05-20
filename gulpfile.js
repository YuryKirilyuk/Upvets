var gulp       = require('gulp'), // Подключаем Gulp
	sass         = require('gulp-sass'), //Подключаем Sass пакет,
	browserSync  = require('browser-sync'), // Подключаем Browser Sync
	concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
	/*uglify       = require('gulp-uglifyjs'),*/ // Подключаем gulp-uglifyjs (для сжатия JS)
	/*cssnano      = require('gulp-cssnano'),*/ // Подключаем пакет для минификации CSS
	rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
	del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
	//imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
	pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
	cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
	plumber = require('gulp-plumber'), // Чтоб при ошибке не падал сервер
	autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов
	spritesmith = require('gulp.spritesmith'); //Для автосборки спрайта
	sourcemaps = require('gulp-sourcemaps'); //Что б в режиме разработчика показывало норм стили



gulp.task('sass', function(){ // Создаем таск Sass
	return gulp.src('assets/scss/**/*.scss') // Берем источник
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(sass({outputStyle: 'compact'}).on('error', sass.logError)) // Преобразуем Sass в CSS посредством gulp-sass				
		.pipe(autoprefixer(['last 10 versions', '> 1%', 'ie 9', 'ie 10'], { cascade: true })) // Создаем префиксы
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('')) // Выгружаем результата в папку app/css
		.pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});


gulp.task('browser-sync', function() { // Создаем таск browser-sync
	browserSync({ // Выполняем browserSync
        proxy: "http://localhost/Upvets",
		notify: false // Отключаем уведомления
	});
});


gulp.task('watch', ['browser-sync'], function() {
	gulp.watch('assets/scss/**/*.scss', ['sass']); // Наблюдение за sass файлами в папке sass
	gulp.watch('*.php', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
	gulp.watch('assets/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
});

gulp.task('clean', function() {
	return del.sync('dist'); // Удаляем папку dist перед сборкой
});


gulp.task('build', ['clean', 'img', 'sass'], function() {

	var buildCss = gulp.src([ // Переносим библиотеки в продакшен
		'style.css'
		])
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/scss/**/*') // Переносим scss в продакшен
	.pipe(gulp.dest('dist/scss'))

	var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
	.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
	.pipe(gulp.dest('dist'));

});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('default', ['watch']);
