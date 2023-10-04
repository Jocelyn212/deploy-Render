const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const mongodb = require("mongodb");

let MongoClient = mongodb.MongoClient;

// CONEXIÓN CON MONGODB VÍA MONGO CLIENT
MongoClient.connect(
  "mongodb+srv://jocelyncf:idvLvNUj0y9jNQtO@grupoc.myft7qs.mongodb.net/?retryWrites=true&w=majority",
  function (err, client) {
    if (err != null) {
      console.log(err);
      console.log("No se ha podido conectar con MongoDB");
    } else {
      app.locals.db = client.db("ProyectoInmobiliaria");
      console.log(
        "Conexión correcta a la base de datos ProyectoInmobiliaria de MongoDB"
      );
    }
  }
);
app.get("/api/viviendas", mostrarVivienda);
app.post("/api/nuevavivienda", añadirVivienda);
app.get("/api/viviendas/buscar", buscarVivienda);
app.put("/api/viviendas/:id", editarVivienda);
app.delete("/api/viviendas/:id", eliminarVivienda);

// CONTROLADOR - VER TODOS LAS VIVIENDAS
function mostrarVivienda(req, res) {
  app.locals.db
    .collection("viviendas")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
}
app.get("/api/viviendas", mostrarVivienda);

function añadirVivienda(req, res) {
  const vivienda = {
    tipo: req.body.tipo,
    estado: req.body.estado,
    descripcion: req.body.descripcion,
    metros: req.body.metros,
    habitaciones: req.body.habitaciones,
    baños: req.body.baños,
    patio: req.body.patio,
    ciudad: req.body.ciudad,
    img1: req.body.img1,
    img2: req.body.img2,
    img3: req.body.img3,
    precio: req.body.precio,
  };
  app.locals.db
    .collection("viviendas")
    .insertOne(vivienda, function (err, res) {
      if (err) throw err;
      console.log("Nueva vivienda insertada");
    });
}

// CONTROLADOR - BUSCAR vivienda por tipo, estado y/o ciudad
function buscarVivienda(req, res) {
  const filtro = {};

  if (req.query.tipo) {
    filtro.tipo = { $regex: req.query.tipo, $options: "i" };
  }

  if (req.query.estado) {
    filtro.estado = { $regex: req.query.estado, $options: "i" };
  }

  if (req.query.ciudad) {
    filtro.ciudad = { $regex: req.query.ciudad, $options: "i" };
  }

  app.locals.db
    .collection("viviendas")
    .find(filtro)
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
}

//Editar vivienda
function editarVivienda(req, res) {
  const viviendaId = req.params.id;
  const nuevoDatosVivienda = {
    tipo: req.body.tipo,
    estado: req.body.estado,
    descripcion: req.body.descripcion,
    metros: req.body.metros,
    habitaciones: req.body.habitaciones,
    baños: req.body.baños,
    patio: req.body.patio,
    ciudad: req.body.ciudad,
    img1: req.body.img1,
    img2: req.body.img2,
    img3: req.body.img3,
    precio: req.body.precio,
  };

  app.locals.db
    .collection("viviendas")
    .updateOne(
      { _id: mongodb.ObjectId(viviendaId) },
      { $set: nuevoDatosVivienda },
      function (err, result) {
        if (err) throw err;
        console.log("Vivienda actualizada");
        res.send(result);
      }
    );
}

//ELIMINAR VIVIENDA
function eliminarVivienda(req, res) {
  const viviendaId = req.params.id;

  app.locals.db
    .collection("viviendas")
    .deleteOne({ _id: mongodb.ObjectId(viviendaId) }, function (err, result) {
      if (err) throw err;
      console.log("Vivienda eliminada");
      res.send(result);
    });
}

app.listen(3000);
