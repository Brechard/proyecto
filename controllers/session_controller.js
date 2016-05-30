
var userController = require('./user_controller');
var url = require('url');

// GET /session   -- Formulario de login
exports.new = function(req, res, next) {

    var redir = req.query.redir || url.parse(req.headers.referer || "/").pathname;

    if (redir === '/session' || redir === '/users/new') { redir = "/"; }

    res.render('session/new', { redir : redir });
};


// POST /session   -- Crear la sesion si usuario se autentica
exports.create = function(req, res, next) {

    var redir     = req.body.redir || '/';
    var login     = req.body.login;
    var password  = req.body.password;

    userController.autenticar(login, password)
        .then(function(user) {
            if (user) {
                // Crear req.session.user y guardar campos id y username
                // La sesión se define por la existencia de: req.session.user
                req.session.user = {id:user.id, 
                                    username:user.username, 
                                    isAdmin: user.isAdmin, 
                                    expires: Date.now() + 120000
                                   };

                res.redirect(redir); // redirección a redir
            } else {
                req.flash('error', 'La autenticación ha fallado. Reinténtelo otra vez.');
                res.redirect("/session?redir="+redir);
            }
        })
		.catch(function(error) {
            req.flash('error', 'Se ha producido un error: ' + error);
            res.redirect("/session");        
    });
};


// DELETE /session   -- Destruir sesion 
exports.destroy = function(req, res, next) {

    delete req.session.user;
    
    res.redirect("/session"); // redirect a login
};

exports.loginRequired = function(req, res, next){
    if(req.session.user)
        next();
    else res.redirect('/session?redir=' + (req.param('redir') || req.url));
}