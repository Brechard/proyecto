var models = require('../models');

exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId).then(function(quiz) {
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
	models.Quiz.findAll().then(function(quizzes){
		res.render('quizzes/index.ejs', {quizzes: quizzes});
	}).catch(function(error){ next(error)});
};

// GET /question
exports.show = function(req, res, next) {
	var answer = req.query.answer || "";
	res.render('quizzes/show', {quiz: req.quiz, answer: answer});
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
	}).catch(function (error) { 
		req.flash('error', 'Error al crear un Quiz: ' +error.message);
		next(error); 
	})
};