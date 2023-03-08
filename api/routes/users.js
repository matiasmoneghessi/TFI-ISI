const { Router } = require("express");
const router = Router();
const User = require("../models/User");
const parseId = require("../utils/functions");
//const paginatedResults = require("../utils/pagination");

/* Rutas
(1) Usuario - Modifica sus datos personales.
(2) Usuario - Muestra sus datos personales.
(3) Administrador - Muestra todos los usuarios con el middleware Pagination. (Comentada porque no se utilizaría)
(4) Administrador - Muestra todos los usuarios.
(5) Administrador - Elimina usuarios.
(6) Administrador - Cambia el rol de usuario a operador.
*/

// (1) Usuario - Modifica sus datos personales.
router.put("/me/:id", (req, res) => {
  const { id } = req.params;
  const { fname, lname, dni, email, operator, address, phone, birthdate } =
    req.body;

  User.updateOne(
    { _id: parseId(id) },
    { fname, lname, dni, email, operator, address, phone, birthdate },
    (err, docs) => {
      res.send({
        items: docs,
      });
    }
  );
});

// (2) Usuario - Muestra sus datos personales.
router.get("/me/:id", (req, res) => {
  const { id } = req.params;

  User.findOne({ _id: id }, (err, result) => {
    res.send(result);
  });
});

// (3) Administrador - Muestra todos los usuarios con el middleware Pagination. (Comentada porque no se utilizaría)
/*router.get("/admin/showUsers", paginatedResults(User,3), (req, res) => {
  User.find({}, (err) => {
    if (err) {
      res.json({ error: "Error" });
    } else {
      res.json(res.paginatedResults);
    }
  });
});*/

// (4) Administrador - Muestra todos los usuarios.
router.get("/admin/:adminId/showUsers", async (req, res) => {
  const { adminId } = req.params;
  const userAdmin = await User.findOne({ _id: parseId(adminId) });

  if (userAdmin.admin === true) {
    User.find({}, (err, result) => {
      if (err) {
        res.json({ error: "Error" });
      } else {
        res.json({ data: result });
      }
    });
  } else {
    res.sendStatus(404);
  }
});

// (5) Administrador - Elimina usuarios.
router.delete("/admin/:adminId/delete/:id", async (req, res) => {
  const { adminId } = req.params;
  const userAdmin = await User.findOne({ _id: parseId(adminId) });
  const { id } = req.params;

  try {
    if (userAdmin.admin === true && adminId !== id) {
      await User.deleteOne({ _id: parseId(id) });
      res.sendStatus(204);
    } else if (adminId === id) {
      res.send("You can't remove the permission yourself").status(404);
    }
  } catch {
    res.sendStatus(500);
  }
});

// (6) Administrador - Cambia el rol de usuario a operador.
router.put("/admin/:adminId/role/:id", async (req, res) => {
  const { adminId } = req.params;
  const userAdmin = await User.findOne({ _id: parseId(adminId) });
  const { id } = req.params;

  try {
    if (userAdmin.admin == true && adminId !== id) {
      await User.findOneAndUpdate({ _id: parseId(id) }, [
        { $set: { operator: { $eq: [false, "$operator"] } } },
      ]);
      res.sendStatus(204);
    } else if (adminId == id) {
      res.send("You can't change your role yourself").status(404);
    }
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports = router;
