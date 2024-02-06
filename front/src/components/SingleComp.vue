<template>
  <div class="container">
    <div class="divprod">
      <div v-for="(produto, index) in produtos" :key="index" class="produto-component">
        <img :src="produto.ProdImagem" alt="" class="img-prod" />
        <h3>{{ produto.ProdDesc }}</h3>
        <span>R$ {{ produto.ProdPreco }}</span>
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
        <div class="botoes">
          <button @click="limparCarrinho">Limpar Carrinho</button>
          <button @click="enviarPedidoParaBanco">Enviar Pedido</button>
        </div>
      </div>
      <div v-else>
        <p>Carrinho vazio</p>
      </div>
    </div>
    <div class="pedidos-info">
      <h4>Pedidos:</h4>
      <div v-if="pedidos.length > 0">
        <ul>
          <li v-for="(pedido, index) in pedidos" :key="index">
            <p>Pedido ID: {{ pedido.PedidoID }}</p>
            <p>Valor Total: {{ pedido.ValorTotal }}</p>

            <ul>
              <li v-for="(itemPedido, index) in getItensPedido(pedido.PedidoID)" :key="index">
                Produto ID: {{ itemPedido.ProdID }} - Quantidade: {{ itemPedido.Quantidade }} -
                Total do Produto: {{ itemPedido.TotalProd }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>Nenhum pedido realizado ainda.</p>
      </div>
      <div v-if="pedidoEnviado">
        <p>Pedido ID: {{ pedidoEnviado.PedidoID }}</p>
        <p>Valor Total: {{ pedidoEnviado.ValorTotal }}</p>
        <ul>
          <li v-for="(item, index) in itensPedidoEnviado" :key="index">
            Produto ID: {{ item.ProdutoID }} - Quantidade: {{ item.Quantidade }} - Total do Produto:
            {{ item.valorTotal }}
          </li>
        </ul>
      </div>
      <button @click="limparPedidos">Limpar Pedidos</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      produtos: [],
      pedidos: [],
      quantidadeCarrinho: 0,
      carrinho: [],
      itensPedido: [],
      pedidoEnviado: null,
      itensPedidoEnviado: []
    }
  },

  mounted() {
    fetch('http://localhost:3000')
      .then((response) => {
        if (!response.ok) {
          throw new Error('nada ok')
        }
        return response.json()
      })
      .then((data) => {
        const pedidos = data.pedidos
        const produtos = data.produtos
        const itensPedido = data.itensPedido
        console.log(pedidos)
        this.produtos = produtos
        this.pedidos = pedidos
        this.itensPedido = itensPedido
      })
      .catch((error) => console.error(error))
  },
  methods: {
    addCarrinho(produto) {
      let carrinho = JSON.parse(localStorage.getItem('carrinho')) || []
      let indexProdutoExistente = carrinho.findIndex((item) => item.ProdId === produto.ProdId)
      if (indexProdutoExistente !== -1) {
        carrinho[indexProdutoExistente].qnt++
      } else {
        carrinho.push({ ...produto, qnt: 1 })
      }
      localStorage.setItem('carrinho', JSON.stringify(carrinho))
      this.updCarrinho()
      this.verCarrinho()
    },
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
    },
    //filtrar itens do pedido com base no id
    getItensPedido(pedidoID) {
      return this.itensPedido.filter((item) => item.PedidoID === pedidoID)
    },
    enviarPedidoParaBanco() {
      const carrinho = JSON.parse(localStorage.getItem('carrinho')) || []
      const novoPedidoID = Math.floor(Math.random() * 1000) + 1
      const valorTotalPedido = carrinho.reduce((total, item) => {
        return total + item.qnt * item.ProdPreco
      }, 0)
      let novoItemPedido
      carrinho.forEach((item) => {
        novoItemPedido = {
          PedidoID: novoPedidoID,
          ProdutoID: item.ProdId,
          Quantidade: item.qnt,
          valorTotal: item.qnt * item.ProdPreco // calcula o valor total do item
        }
        console.log(novoItemPedido)
      })

      const novoPedido = {
        PedidoID: novoPedidoID,
        ValorTotal: valorTotalPedido
      }

      console.log(novoPedido)

      // Atualiza as variáveis com os dados do pedido enviado
      this.pedidoEnviado = novoPedido
      this.itensPedidoEnviado = carrinho.map((item) => ({
        ProdutoID: item.ProdId,
        Quantidade: item.qnt,
        valorTotal: item.qnt * item.ProdPreco
      }))

      // Limpa o carrinho após o pedido ser enviado
      this.limparCarrinho()
    },
    limparPedidos() {
      this.pedidos = []
    }
  }
}
</script>

<style scoped>
.produto-component {
  height: 280px;
  width: 280px;
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
  border-radius: 15px;
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
@media only screen and (max-width: 1024px) {
  .divprod {
    flex-direction: column;
    align-items: center;
    flex-wrap: wrap;
  }
}
.carrinho-info {
  display: flex;
  flex-direction: column;
  padding: 5vh;
  background-color: aquamarine;
  color: black;
}
button {
  padding: 5px;
  border-radius: 10px;
}
.pedidos-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  padding: 5vh;
  background-color: aqua;
  color: black;
}
.botoes {
  display: flex;
  flex-direction: row;
  justify-content: start;
  gap: 20px;
  margin: 20px;
}
</style>
