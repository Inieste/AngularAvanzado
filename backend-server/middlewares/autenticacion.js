var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// ==============================================
//      Verificar token
// ==============================================
exports.verificaToken = function(req, res, next) {


    var token = req.query.token;
    jwt.verify(token, SEED, (error, decoded) => {
        if (error) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errores: error
            });
        }

        req.usuario = decoded.usuario;

        next();
    });
}
