const { Router } = require("express");
const router = Router();
const User = require("../models/User");
const BranchOffice = require("../models/BranchOffice");
const parseId = require("../utils/functions");

/* Rutas
(1) Administrador - Crear una sucursal.
(2) Muestra todas las sucursales.
(3) Administrador - Elimina una sucursal.
(4) Administrador - Modifica datos de una sucursal.
(5) Administrador - Muestra todos los operadores disponibles para asignar a una sucursal.
(6) Administrador - Reemplaza y vincula un operador a una sucursal.
(7) Administrador - Quitar un operador de una sucursal. (Comentada porque no se utilizaría)
*/

// (1) Administrador - Crear una sucursal.
router.post("/admin/:adminId/add", async (req, res) => {
  const { adminId } = req.params;

  const {
    location,
    address,
    phone,
    email,
    startTime,
    endTime,
    daysOff,
    simultAppointment,
    price,
  } = req.body;

  const newBranchOffice = new BranchOffice({
    location,
    address,
    phone,
    email,
    startTime,
    endTime,
    daysOff,
    simultAppointment,
    price,
  });

  try {
    const userAdmin = await User.findOne({ _id: parseId(adminId) });
    if (userAdmin.admin === true) {
      const saveBranchOffice = await newBranchOffice.save();
      res.json({ error: null, data: saveBranchOffice });
    } else {
      res
        .send("You don't have permission to create a new branch office")
        .status(404);
    }
  } catch (error) {
    res.status(404).json(error);
  }
});

// (2) Muestra todas las sucursales.
router.get("/showBranch", async (req, res) => {
  await BranchOffice.find({}, (err, result) => {
    if (err) {
      res.json({ error: "Error" });
    } else {
      res.json({ data: result });
    }
  })
    .clone()
    .exec();
});

// (3) Administrador - Elimina una sucursal.
router.delete("/admin/:adminId/delete/:id", async (req, res) => {
  const { adminId } = req.params;
  const { id } = req.params;
  const userAdmin = await User.findOne({ _id: parseId(adminId) });

  try {
    if (userAdmin.admin === true && adminId !== id) {
      await BranchOffice.deleteOne({ _id: parseId(id) });
      res.sendStatus(204);
    } else if (adminId === id) {
      res.send("You can't remove the permission yourself").status(404);
    }
  } catch {
    res.sendStatus(500);
  }
});

// (4) Administrador - Modifica datos de una sucursal.
router.put("/admin/:adminId/:id", async (req, res) => {
  const { adminId } = req.params;
  const { id } = req.params;

  const {
    location,
    address,
    phone,
    email,
    startTime,
    endTime,
    daysOff,
    simultAppointment,
    price,
  } = req.body;
  const userAdmin = await User.findOne({ _id: parseId(adminId) });
  try {
    if (userAdmin.admin === true) {
      BranchOffice.updateOne(
        { _id: parseId(id) },
        {
          location,
          address,
          phone,
          email,
          startTime,
          endTime,
          daysOff,
          simultAppointment,
          price,
        },
        (err, docs) => {
          if (err) {
            res.json({ error: "Error" });
          } else {
            res.send({
              items: docs,
            });
          }
        }
      );
    } else {
      res
        .send("You don't have permission to modify the information of a branch")
        .status(404);
    }
  } catch (error) {
    res.status(404).json(error);
  }
});

// (5) Administrador - Muestra todos los operadores disponibles para asignar a una sucursal.
router.get(
  "/admin/:adminId/showBranch/:branchId/operator",
  async (req, res) => {
    const { adminId } = req.params;
    const userAdmin = await User.findOne({ _id: parseId(adminId) });

    try {
      if (userAdmin.admin === true) {
        await User.find({ operator: true }, (err, result) => {
          if (err) {
            return res.json({ error: "Error" });
          } else {
            console.log(result); //devuelve un arreglo de objetos con toda la data del operator
            return res.send({ data: result });
          }
        })
          .clone()
          .exec();
      } else {
        res
          .status(404)
          .send(
            "You don't have permission to modify the information of a branch"
          );
      }
    } catch (error) {
      res.status(404).json(error);
    }
  }
);

// (6) Administrador - Reemplaza y vincula un operador a una sucursal.
router.put("/admin/:adminId/showBranch/:branchId", async (req, res) => {
  const { adminId, branchId } = req.params;
  const operatorId = req.body._id;
  const userAdmin = await User.findOne({ _id: parseId(adminId) });
  const branchOffice = await BranchOffice.findOne({ _id: parseId(branchId) });

  try {
    if (userAdmin.admin === true) {
      if (branchOffice.operator.length) {

        // reememplazar operador en sucursal
        await BranchOffice.findByIdAndUpdate(branchId, {
          $pull: { operator: branchOffice.operator[0] },
        })
        await BranchOffice.findByIdAndUpdate(branchId, {
          $push: { operator: operatorId },
        }).populate("operator");

        // reememplazar atributo branchOffice en collection User
        await User.findByIdAndUpdate(branchOffice.operator[0], {
          $pull: { branchOffice: branchId },
        })

        await User.findByIdAndUpdate(operatorId, {
          $push: { branchOffice: branchId },
        })
          .populate("branchOffice")

          .exec(() => {
            res.json("Operador reemplazado").status(204);
          });
      } else {

        await BranchOffice.findByIdAndUpdate(branchId, {
          $push: { operator: operatorId },
        }).populate("operator");

        await User.findByIdAndUpdate(operatorId, {
          $push: { branchOffice: branchId },
        })
          .populate("branchOffice")
          .exec(() => {
            res.json("Operador incorporado").status(200);
          });
      }
    } else {
      res
        .send("You don't have permission to modify the information of a branch")
        .status(404);
    }
  } catch (error) {
    res.status(404).json(error);
  }
});

// // (7) Administrador - Quitar un operador de una sucursal. Comentada porque no se utilizaría)
// router.put(
//   "/admin/:adminId/showBranch/:branchId/operator",
//   async (req, res) => {
//     const { adminId, branchId } = req.params;
//     const userAdmin = await User.findOne({ _id: parseId(adminId) });
//     try {
//       if (userAdmin.admin === true) {
//         const operatorId = req.body._id;
//         await BranchOffice.findByIdAndUpdate(branchId, {
//           $pull: { operator: operatorId },
//         });
//         res.json("Operador eliminado").status(204);
//       } else {
//         res
//           .send(
//             "You don't have permission to modify the information of a branch"
//           )
//           .status(404);
//       }
//     } catch (error) {
//       res.status(404).json(error);
//     }
//   }
// );

module.exports = router;