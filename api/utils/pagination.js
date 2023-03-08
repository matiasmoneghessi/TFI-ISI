//Middleware para realizar la paginación a la información que queremos enviar.
//Como argumento se pasa la collection que vamos a paginar y el numero límite que queremos que se vea por página.
//Middleware no utilizado porque se atajó desde el front. Ejemplo de como usarlo: Carpeta 'routes' - Archivo 'users.js'. - (3)

function paginatedResults(model, num) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = num;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < await model.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    try {
      results.data = await model.find().limit(limit).skip(startIndex).exec();
      res.paginatedResults = results;
      next();
    }
    catch (err) { res.status(500).json({ error: err }) }
  };
}

module.exports = paginatedResults;