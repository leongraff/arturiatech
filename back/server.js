const http = require("http");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("database.db", (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Conexão estabelecida com sucesso.");
  }
});

//script criaçao do banco
//db.run(
//   `CREATE TABLE IF NOT EXISTS Produtos(
//         ProdId INTEGER PRIMARY KEY AUTOINCREMENT,
//         ProdDesc TEXT,
//         ProdPreco FLOAT,
//         ProdImagem BLOB
//     )`,
//   (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("tabela criada com sucesso");
//     }
//   }
// );

const buscarProdutos = (callback) => {
  db.all("SELECT * FROM Produtos", (err, rows) => {
    if (err) {
      console.log(err);
      callback([]);
    } else {
      const produtos = rows.map((row) => {
        const imagemBase64 = Buffer.from(row.ProdImagem).toString("base64");
        return { ...row, ProdImagem: `data:image/jpeg;base64,${imagemBase64}` };
      });
      callback(produtos);
    }
  });
};

const buscarPedidos = (callback) => {
  db.all("SELECT * FROM Pedidos", (err, rows) => {
    if (err) {
      console.log(err);
      callback([]);
    } else {
      callback(rows);
    }
  });
};

const buscarItensPedido = (callback) => {
  db.all("SELECT * FROM ItensPedido", (err, rows) => {
    if (err) {
      console.log(err);
      callback([]);
    } else {
      callback(rows);
    }
  });
};

const pesquisa = (callback) => {
  const resultado = {};

  buscarProdutos((produtos) => {
    resultado.produtos = produtos;

    buscarPedidos((pedidos) => {
      resultado.pedidos = pedidos;

      buscarItensPedido((itensPedido) => {
        resultado.itensPedido = itensPedido;
        callback(resultado);
      });
    });
  });
};

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "GET" && req.url === "/") {
    pesquisa((result) => {
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify(result));
      console.log("endpoint chamado");
      res.end();
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Endpoint não encontrado");
  }
});

// const pesquisa = (callback) => {
//   db.all("SELECT * FROM PRODUTOS", (err, rows) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("tabela criada com sucesso");
//     }
//   });
// };

// const server = http
//   .createServer((req, res) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//     if (req.method === "GET" && req.url === "/") {
//       pesquisa((result) => {
//         res.setHeader("Content-Type", "application/json");
//         res.write(JSON.stringify(result));
//         res.end();
//       });
//     } else {
//       res.writeHead(404, { "Content-Type": "text/plain" });
//       res.end("Endpoint não encontrado");
//     }
//     // if (req.method === "POST") {
//     //   let body = "";
//     //   req.on("data", (chunk) => {
//     //     body += chunk;
//     //   });
//     //   req.on("end", () => {
//     //     //deserializa as infos
//     //     const parsedBody = JSON.parse(body);
//     //     console.log(parsedBody);
//     //     insertData.run(
//     //       parsedBody.ProdId,
//     //       parsedBody.ProdDesc,
//     //       parsedBody.ProdPreco
//     //     );
//     //     console.log("Dados criados com sucesso.");
//     //   });
//     // } else if (req.method === "DELETE") {
//     //   let body = "";
//     //   req.on("data", (chunk) => {
//     //     body += chunk;
//     //   });
//     //   req.on("end", () => {
//     //     const parsedBody = JSON.parse(body);
//     //     console.log(parsedBody);
//     //     deleteData.run(parsedBody.ProdId);
//     //     console.log("Dados excluídos com sucesso.");
//     //   });
//     // } else if (req.method === "PUT") {
//     //   let body = "";
//     //   req.on("data", (chunk) => {
//     //     body += chunk;
//     //   });
//     //   req.on("end", () => {
//     //     const parsedBody = JSON.parse(body);
//     //     console.log(parsedBody);
//     //     modifyData.run(
//     //       parsedBody.ProdId,
//     //       parsedBody.ProdDesc,
//     //       parsedBody.ProdPreco
//     //     );
//     //     console.log("Dados modificados com sucesso.");
//     //   });
//     // }
//   })
//   .on("error", (err) => {
//     console.error("Erro ao criar o servidor:", err);
//   });

//usado para teste na porta 3000 (ver se realmente estavam sendo trazidos os dados do bd para a porta

const port = 3000;
server.listen(port);
console.log(`Servidor escutando na porta ${port}`);
