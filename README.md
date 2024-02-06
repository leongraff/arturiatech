Teste técnico Arturia:

Minha primeira tentativa de realizar o teste técnico foi em Next/JS pois acreditei ser uma boa oportunidade de aprender.
Entretando testei algumas ferramentas de abstração para conexão ao sqlite3, todas as tentativas falhas
Decidi usar a oportunidade para criar algo com Vue, apesar da pouca experiência com o framework

o backend está rodando na porta 3000 com o comando node server.js
observações sobre o backend:

- o correto nesse caso teria sido criar uma tabela a mais para os preços, porém não consegui identificar isso de primeira, o que provavelmente dificulta a parte de integração do front, pois me impossibilitou de tratar preço como foreign key, e me faz ter que tratar esse valor antes da inserção etc

sobre o front:

- não tive tempo de integrar a parte de pedidos com o backending, infelizmente, e ainda faltaram tratativas na função principal que trata a parte de pedido.
- por falta de conhecimento da ferramenta não tive tempo de globalizar as funções, porém notei que ele trata de forma bem leve a renderização o que me levou a empenhar mais tempo na logica do carrinho e deixar de lado o que seria o correto: criar mais paginas e componentes para dividir responsabilidades.
- está tudo no singlecomponent, dentro de components, basicamente.
- sobre responsividade acrescentei somente uma mediaquery para wrapar a flexbox com menos de 1024px;

há realmente muito a melhorar no projeto porém desde já agradeço a oportunidade.
att, leon.
