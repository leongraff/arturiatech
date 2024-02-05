const http = require("http");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("produtos.db", (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Conexão estabelecida com sucesso.");
  }
});

// db.run(
//   `CREATE TABLE IF NOT EXISTS Produtos(
//         ProdId INTEGER PRIMARY KEY AUTOINCREMENT,
//         ProdDesc TEXT,
//         ProdPreco FLOAT
//     )`,
//   (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("tabela criada com sucesso");
//     }
//   }
// );

const pesquisa = (callback) => {
  db.all("SELECT * FROM PRODUTOS", (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      console.log("tabela criada com sucesso");
    }
  });
};

const server = http
  .createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    pesquisa((result) => {
      res.write(JSON.stringify(result));
      res.end();
    });
    //   if (req.method === "POST") {
    //     let body = "";
    //     req.on("data", (chunk) => {
    //       body += chunk;
    //     });
    //     req.on("end", () => {
    //       //deserializa as infos
    //       const parsedBody = JSON.parse(body);
    //       console.log(parsedBody);
    //       insertData.run(
    //         parsedBody.ProdId,
    //         parsedBody.ProdDesc,
    //         parsedBody.ProdPreco
    //       );
    //       console.log("Dados criados com sucesso.");
    //     });
    //   } else if (req.method === "DELETE") {
    //     let body = "";
    //     req.on("data", (chunk) => {
    //       body += chunk;
    //     });
    //     req.on("end", () => {
    //       const parsedBody = JSON.parse(body);
    //       console.log(parsedBody);
    //       deleteData.run(parsedBody.ProdId);
    //       console.log("Dados excluídos com sucesso.");
    //     });
    //   } else if (req.method === "PUT") {
    //     let body = "";
    //     req.on("data", (chunk) => {
    //       body += chunk;
    //     });
    //     req.on("end", () => {
    //       const parsedBody = JSON.parse(body);
    //       console.log(parsedBody);
    //       modifyData.run(
    //         parsedBody.ProdId,
    //         parsedBody.ProdDesc,
    //         parsedBody.ProdPreco
    //       );
    //       console.log("Dados modificados com sucesso.");
    //     });
    //   }
  })
  .on("error", (err) => {
    console.error("Erro ao criar o servidor:", err);
  });

const port = 3000;
server.listen(port);
console.log(`Servidor escutando na porta ${port}`);
