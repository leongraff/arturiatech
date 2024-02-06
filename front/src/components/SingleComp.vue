<template>
  <div class="container">
    <div class="divprod">
      <div v-for="(produto, index) in produtos" :key="index" class="produto-component">
        <img :src="produto.ProdImagem" alt="" class="img-prod" />
        <h3>{{ produto.ProdDesc }}</h3>
        <span>{{ produto.ProdPreco }}</span>
        <button @click="addCarrinho(produto)">Adicionar ao Carrinho</button>
      </div>
    </div>

    <div class="carrinho-info">
      <p>Itens no Carrinho: {{ quantidadeCarrinho }}</p>
      <div v-if="carrinho.length > 0">
        <h4>Itens no Carrinho:</h4>
        <ul>
          <li v-for="(item, index) in carrinho" :key="index">
            {{ item.ProdDesc }} - Quantidade: {{ item.qnt }}
          </li>
        </ul>
        <button @click="limparCarrinho">Limpar Carrinho</button>
      </div>
      <div v-else>
        <p>Carrinho vazio</p>
      </div>
    </div>
  </div>
</template>

<script>
//criando o componente com base no que está no bd
export default {
  //definindo valores iniciais do componente
  data() {
    return {
      produtos: [],
      quantidadeCarrinho: 0,
      carrinho: []
    }
  },
  //faz requisição get para pegar os produtos cadastrados no bd (que está separado)
  mounted() {
    fetch('http://localhost:3000')
      .then((response) => response.json())
      .then((data) => {
        this.produtos = data
      })
      .catch((error) => console.error(error))
    //traz valor inicial do localstorage
    this.verCarrinho()
  },
  methods: {
    addCarrinho(produto) {
      //obtem carrinho ou inicializa vazio
      let carrinho = JSON.parse(localStorage.getItem('carrinho')) || []
      //procura o
      let indexProdutoExistente = carrinho.findIndex((item) => item.ProdId === produto.ProdId)
      //findIndex retorna -1 quando o elemento não é encontrado no array
      if (indexProdutoExistente !== -1) {
        carrinho[indexProdutoExistente].qnt++
      } else {
        //em ambos os casos "qnt" é definida dinamicamente, usada depois para trazer para o html e atualizar a qnt total
        carrinho.push({ ...produto, qnt: 1 })
      }
      localStorage.setItem('carrinho', JSON.stringify(carrinho))
      this.updCarrinho()
      this.verCarrinho()
    },
    //reduce é usada para trazer o total da array
    updCarrinho() {
      const carrinho = JSON.parse(localStorage.getItem('carrinho')) || []
      const quantidadeTotal = carrinho.reduce((total, item) => total + item.qnt, 0)
      this.quantidadeCarrinho = isNaN(quantidadeTotal) ? 0 : quantidadeTotal
    },
    verCarrinho() {
      this.carrinho = JSON.parse(localStorage.getItem('carrinho')) || []
    },
    limparCarrinho() {
      localStorage.removeItem('carrinho')
      this.updCarrinho()
      this.verCarrinho()
    }
  }
}
</script>

<style scoped>
.produto-component {
  height: 250px;
  width: 250px;
  background-color: white;
  border-radius: 15px;
  margin: 15px 35px 15px 35px;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3px;
}
.img-prod {
  max-width: 150px;
  max-height: 150px;
}
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.divprod {
  display: flex;
  flex-direction: row;
  justify-items: center;
  align-items: center;
  justify-content: center;
}
.carrinho-info {
  background-color: aquamarine;
  color: black;
}
</style>
