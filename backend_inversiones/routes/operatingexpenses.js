var express = require("express");
var router = express.Router();
var connection = require("../database");

router.get("/", function (req, res) {
  const query = "SELECT * FROM operating_expenses;";

  connection.query(query, function (error, results) {
    if (error) {
      return res.status(500).json({
        error: error,
        message: "Error in the query",
      });
    }

    res.status(200).json({
      data: results,
      message: "List of operating expenses and investments",
    })
  });
});

router.get("/:id", function (req, res) {
  const { id } = req.params; // ID del gasto operativo
  const query = "SELECT * FROM operating_expenses WHERE id = ?"; // Buscamos por 'id'

  connection.query(query, [id], function (error, results) {
    if (error) {
      return res.status(500).json({
        error: error,
        message: "Error in the query",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "No operating expense found with the provided ID",
      });
    }

    res.status(200).json({
      data: results[0], // Retorna solo un objeto, el que corresponde al ID
      message: "Operating expense details",
    });
  });
});


router.get("/project/:id", function (req, res) {
  const { id } = req.params; 
  const query = `SELECT * FROM operating_expenses
              WHERE project_id = ${id};`;

  connection.query(query, function (error, results) {
    if (error) {
      return res.status(500).json({
        error: error,
        message: "Error in the query",
      });
    }

    res.status(200).json({
      data: results,
      message: "Details of operating expenses",
    });
  });
});

router.post("/", (req, res) => {
  const { name, description, expenses, project_id } = req.body;

  const query =
    "INSERT INTO operating_expenses (name, description, expenses, project_id) VALUES (?, ?, ?, ?);";

  connection.query(
    query,
    [name, description, expenses, project_id],
    function (error, results) {
      if (error) {
        return res.status(400).json({
          error: error,
          message: "Project ID error post",
        });
      }

      res.status(201).json({
        message: "POST succesfully",
      });
    }
  );
});

router.put("/:id", (req, res) => {
  const { name, description, expenses, project_id } = req.body;
  const id = req.params.id;

  const query =
    "UPDATE operating_expenses SET name = ?, description = ?, expenses = ?, project_id = ? WHERE id = ?";

  connection.query(
    query,
    [name, description, expenses, project_id, id],
    function (error, results) {
      if (error) {
        return res.status(500).json({
          message: "Project ID ERROR",
        });
      }

      res.status(200).json({
        error: error,
        message: "Succesfully PUT",
      });
    }
  );
});

router.patch("/:id", function (req, res) {
  const query =
    "UPDATE  operating_expenses SET deleted = !deleted WHERE id= ?;";

  connection.query(query, [req.params.id], function (error, results) {
    if (error) {
      res.status(500).json({
        error: error,
        message: "Error DELETE",
      });
    }
    res.status(200).json({
      message: "Succesfully DELETE",
    });
  });
});

module.exports = router;
