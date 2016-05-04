var path = require('path');

// Cargar el Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequelize = new Sequelize(null,null,null, 
						{ dialect: "sqlite", storage: "quiz.sqlite"});

// Impoprtar la definición de la table Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function(){
	return Quiz.count().then(function (c) {
		if(c === 0) { // La tabla se inializa si la tabla está vacía
			return Quiz.create({question: 'Capital de Italia', answer: 'Roma'})
			.then(function(){
				console.log('Base de datos inicializada con datos');
			});

		}
	});
}).cath(function(error) {
	console.log("Error Sincronizando las tablas de la BBDD: ", error);
	process.exit(1)M
});

exports.Quiz = Quiz;