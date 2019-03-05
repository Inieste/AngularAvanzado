var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Hospital = require('../models/hospital');

// ==============================================
//      Obtener todos los hospitales
// ==============================================
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((error, hospitales) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando hospitales',
                errores: error
            });
        }

        Hospital.count({}, (error, count) => {
            res.status(200).json({
                ok: true,
                hospitales: hospitales,
                total: count
            });
        });
    });
});

// ==============================================
//      Actualizar hospital
// ==============================================
app.put('/:id',  mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (error, hospital) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errores: error
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errores: { message: 'No existe un hospital con ese ID'}
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((error, hospitalGuardado) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errores: error
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });
    });
});

// ==============================================
//      Crear un nuevo hospital
// ==============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id

    });

    hospital.save((error, hospitalGuardado) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errores: error
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });
});

// ==============================================
//      Borrar un hospital por el id
// ==============================================
app.delete('/:id',  mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (error, hospitalBorrado) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errores: error
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id',
                errores: { message: 'No existe un hospital con ese id'}
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });
});

module.exports = app;
