const Router = require("express").Router();
const ObjectId = require("mongodb").ObjectId;
const disciplina = Router;

disciplina.post("/", async (req, res) => {
  async function validate(body) {
    if (
      !!body.nome &&      
      !!body.idProfessor &&      
      !!body.semestre &&
      !!body.cargahoraria
    ) {
      const findProfessor = await collection
        .find(ObjectId(body.idProfessor))
        .toArray();
      return findProfessor.length == 1 && findProfessor[0].perfil == "professor"
        ? true
        : false;
    } else return false;
  }

  const client = req.app.locals.bd;
  let collection = client.collection("Usuarios");
  let isValid = await validate(req.body);
  if (isValid) {
    try {
      const insertOne = await client
        .collection("Disciplinas")
        .insertOne({
          nome: req.body.nome,          
          idProfessor: req.body.idProfessor,
          descricao: req.body.descricao,
          semestre: req.body.semestre,
          cargahoraria: req.body.cargahoraria,
        });
      res.status(200).send("OK");
    } catch (error) {
      res.status(400).send(error);
    }
  } else {
    res.status(400).send("Entrada inválida");
  }
});
module.exports = disciplina;