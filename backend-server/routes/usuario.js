var express = require('express');
var bcrypt = require('bcryptjs');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario');

// ==============================================
//      Obtener todos los usuarios
// ==============================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email imagen role')
        .skip(desde)
        .limit(5)
        .exec(
            (error, usuarios) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errores: error
                    });
                }

                Usuario.count({}, (error, count) => {
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: count
                    });
                })
            }
         );
});

// ==============================================
//      Actualizar usuario
// ==============================================
app.put('/:id',  mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (error, usuario) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errores: error
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'EL usuario con el id' + id + ' no existe',
                errores: { message: 'No existe un usuario con ese ID'}
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((error, usuarioGuardado) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errores: error
                });
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});

// ==============================================
//      Crear un nuevo usuario
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        imagen: body.imagen,
        role: body.role
    });

    usuario.save((error, usuarioGuardado) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errores: error
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });
});

// ==============================================
//      Borrar un usuario por el id
// ==============================================
app.delete('/:id',  mdAutenticacion.verificaToken, (req, res) => {
   var id = req.params.id;

   Usuario.findByIdAndRemove(id, (error, usuarioBorrado) => {
       if (error) {
           return res.status(500).json({
               ok: false,
               mensaje: 'Error al borrar usuario',
               errores: error
           });
       }

       if (!usuarioBorrado) {
           return res.status(400).json({
               ok: false,
               mensaje: 'No existe un usuario con ese id',
               errores: { message: 'No existe un usuario con ese id'}
           });
       }

       res.status(200).json({
           ok: true,
           usuario: usuarioBorrado
       });
   });
});

module.exports = app;
