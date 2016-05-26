var path = require('path');

// Cargar el Modelo ORM
var Sequelize = require('sequelize');


var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);

var DATABASE_PROTOCOL = url[1];
var DATABASE_DIALECT = url[1];
var DATABASE_USER = url[2];
var DATABASE_PASSWORD = url[3];
var DATABASE_HOST = url[4];
var DATABASE_PORT = url[5];
var DATABASE_NAME = url[6];
var DATABASE_STORAGE = process.env.DATABASE_STORAGE;

// Usar BBDD SQLite
var sequelize = new Sequelize(
	DATABASE_NAME,
	DATABASE_USER,
	DATABASE_PASSWORD, 
	{ dialect: DATABASE_DIALECT, 
		protocol: DATABASE_PROTOCOL,
		port: DATABASE_PORT,
		host: DATABASE_HOST,
		storage: DATABASE_STORAGE,			// solo sqlite
		omitNull: true });					// solo pg

// Impoprtar la definición de la table Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

// Importar la definicion de la tabla Comments de comment.js
var Comment = sequelize.import(path.join(__dirname,'comment'));

// Relaciones entre modelos
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; // exportar definición de tabla Quiz
exports.Comment = Comment; // exportar definición de tabla Comments
