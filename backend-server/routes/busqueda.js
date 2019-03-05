var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// ==============================================
//      Búsqueda generao
// ==============================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regEx = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHospitales(busqueda, regEx),
            buscarMedicos(busqueda, regEx),
            buscarUsuarios(busqueda, regEx)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospital: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });
});

// ==============================================
//      Búsqueda por coleccion
// ==============================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regEx = new RegExp(busqueda, 'i');
    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regEx);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regEx);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regEx);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de búsqueda sólo son: usuarios, médicos y hospitales',
                error: { message: 'Tipo de tabla/colección no válido'}
            });
    }

    promesa.then(data => {
       res.status(200).json({
           ok: true,
           [tabla]: data
       });
    });
});

function buscarHospitales(busqueda, regEx) {

    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regEx })
            .populate('usuario', 'nombre email')
            .exec((error, hospitales) => {
                if (error) {
                    reject('Error al cargar hospitales', error);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarMedicos(busqueda, regEx) {

    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regEx })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((error, medicos) => {
                if (error) {
                    reject('Error al cargar medicos', error);
                } else {
                    resolve(medicos);
                }
            });
    });
}

function buscarUsuarios(busqueda, regEx) {

    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regEx }, { 'email': regEx }])
            .exec((error, usuarios) => {
                if (error) {
                    reject('Error al cargar usuarios', error);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;
