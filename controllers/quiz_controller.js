var models = require('../models');
var Sequelize = require('sequelize');

exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId, { include: [ models.Comment ] })
    .then(function(quiz) {
      		if (quiz) {
        		req.quiz = quiz;
        		next();
      		} else { 
      			next(new Error('No existe quizId=' + quizId));
      		}
        }).catch(function(error) { next(error); });
};

// GET /index
exports.index = function(req, res, next) {
    var tipo = req.params.format;
  if (tipo == "json") {
    models.Quiz.findAll().then(function (quizzes) {
      res.send("<html><head></head><body>"+JSON.stringify(quizzes)+"</body></html>");
    })
  } else {
  	if(req.query.search){
  		models.Quiz.findAll({ where: ["question like ?",'%' + req.query.search + '%']})
  		  .then(models.Quiz.findAll({ order: ['question']}))
        		.then(function(quizzes) {
          		res.render('quizzes/index.ejs', { quizzes: quizzes});
        		})
        .catch(function(error) {
          next(error);
        });
  	} else {
  		models.Quiz.findAll().then(function(quizzes){
  			res.render('quizzes/index.ejs', {quizzes: quizzes});
  		}).catch(function(error){ next(error)});		
  	}
  }
};

// GET /question
exports.show = function(req, res, next) {
  var tipo = req.params.format;
  if (tipo == "json") {
    res.send("<html><head></head><body>"+JSON.stringify(req.quiz)+"</body></html>");
  } else {
    var answer = req.query.answer || "";
    res.render('quizzes/show', {quiz: req.quiz, answer: answer});    
  }
};

// GET /check
exports.check = function(req, res, next) {
	var answer = req.query.answer || "";
	var result = answer === req.quiz.answer ? 'Correcta' : 'Incorrecta';
	res.render('quizzes/result', {quiz: req.quiz, result: result, answer: answer});
};

// GET /quizzes/new
exports.new = function(req, res, next) {
  var quiz = models.Quiz.build({question: "", answer: ""});
  res.render('quizzes/new', {quiz: quiz});
};

exports.create = function(req,res,next){
	var quiz = models.Quiz.build({question: req.body.quiz.question,
								  answer: 	req.body.quiz.answer});
	// Guardar en la base de datos la nueva pregunta
	quiz.save({fields: ["question", "answer"]}).then(function(quiz){
		req.flash('success','Quiz creado con éxito.');
		res.redirect('/quizzes');
	}).catch(Sequelize.ValidationError, function(error){
		req.flash('error', 'Errores en el formulario:');
		for (var i in error.errors) {
			req.flash('error',error.errors[i].value);
		};
		res.render('quizzes/new', {quiz: quiz});
	}).catch(function (error) { 
		req.flash('error', 'Error al crear un Quiz: ' +error.message);
		next(error); 
	})
};

exports.edit = function(req, res, next) {
  var quiz = req.quiz;  // req.quiz: autoload de instancia de quiz

  res.render('quizzes/edit', {quiz: quiz});
};

exports.update = function(req, res, next) {

  req.quiz.question = req.body.quiz.question;
  req.quiz.answer   = req.body.quiz.answer;

  req.quiz.save({fields: ["question", "answer"]})
    .then(function(quiz) {
	  req.flash('success', 'Quiz editado con éxito.');
      res.redirect('/quizzes'); // Redirección HTTP a lista de preguntas.
    })
    .catch(Sequelize.ValidationError, function(error) {
      req.flash('error', 'Errores en el formulario:');
      for (var i in error.errors) {
          req.flash('error', error.errors[i].value);
      };
      res.render('quizzes/edit', {quiz: req.quiz});
    })
    .catch(function(error) {
	  req.flash('error', 'Error al editar el Quiz: '+error.message);
      next(error);
    });
};

exports.destroy = function(req, res, next) {
  req.quiz.destroy()
    .then( function() {
	  req.flash('success', 'Quiz borrado con éxito.');
      res.redirect('/quizzes');
    })
    .catch(function(error){
	  req.flash('error', 'Error al editar el Quiz: '+error.message);
      next(error);
    });
};
