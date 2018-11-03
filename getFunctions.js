module.exports = {
  classes: function getClasses(res, mysql, context) {
    mysql.pool.query("SELECT id, name, weakness FROM classes", function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.classes = results;
    })
  }
}

