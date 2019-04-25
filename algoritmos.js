Direction = {
  LEFT: "left",
  RIGHT: "right",
  UP: "up",
  DOWN: "dow"
}

Algoritmo = {
  LARGURA: "Busca em largura",
  PROFUNDIDADE: "Busca em profundidade",
  A: "Busca com A*"
}

Estado = {
  repetidos: []
}

class Jogo8 {
  constructor(dimension, algoritmo) {
    this.borda = []
    this.resolucao = []
    this.dimension = 3
    this.algoritmo = algoritmo
    this.lastMove = null
    this.estadosRepetidos = []
    for (var i = 0; i < dimension; i++) {
      this.borda.push([])
      for (var j = 0; j < dimension; j++) {
        if (i == this.dimension - 1 && j == this.dimension - 1) {
          this.borda[i].push(0)
        } else {
          this.borda[i].push(dimension * i + j + 1)
        }
      }
    }
  }
  // Pega a posição do espaço em branco
  getPosicaoEspacoBranco() {
    for (var i = 0; i < this.dimension; i++) {
      for (var j = 0; j < this.dimension; j++) {
        if (this.borda[i][j] == 0) {
          return [i, j]
        }
      }
    }
  }
  // troca dois items de lugar em um array bidimensional
  troca(i, j, k, l) {
    var temp = this.borda[i][j]
    this.borda[i][j] = this.borda[k][l]
    this.borda[k][l] = temp
  }
  // Retorna a direção em que um número pode ser movido
  getMove(num) {
    var PosicaoEspacoBranco = this.getPosicaoEspacoBranco()
    var linha = PosicaoEspacoBranco[0]
    var coluna = PosicaoEspacoBranco[1]
    if (linha > 0 && num == this.borda[linha - 1][coluna]) {
      return Direction.DOWN
    } else if (
      linha < this.dimension - 1 &&
      num == this.borda[linha + 1][coluna]
    ) {
      return Direction.UP
    } else if (coluna > 0 && num == this.borda[linha][coluna - 1]) {
      return Direction.RIGHT
    } else if (
      coluna < this.dimension - 1 &&
      num == this.borda[linha][coluna + 1]
    ) {
      return Direction.LEFT
    }
  }
  // Move um número se possível e retorna a direção desse movimento
  move(num) {
    var move = this.getMove(num)
    if (move != null) {
      var PosicaoEspacoBranco = this.getPosicaoEspacoBranco()
      var linha = PosicaoEspacoBranco[0]
      var coluna = PosicaoEspacoBranco[1]
      switch (move) {
        case Direction.LEFT:
          this.troca(linha, coluna, linha, coluna + 1)
          break
        case Direction.RIGHT:
          this.troca(linha, coluna, linha, coluna - 1)
          break
        case Direction.UP:
          this.troca(linha, coluna, linha + 1, coluna)
          break
        case Direction.DOWN:
          this.troca(linha, coluna, linha - 1, coluna)
          break
      }
      if (move != null) {
        this.lastMove = num
      }
      return move
    }
  }

  verificaObjetivo() {
    for (var i = 0; i < this.dimension; i++) {
      for (var j = 0; j < this.dimension; j++) {
        var num = this.borda[i][j]
        if (num != 0) {
          var linhaOriginal = Math.floor((num - 1) / this.dimension)
          var colunaOriginal = (num - 1) % this.dimension
          if (i != linhaOriginal || j != colunaOriginal) return false
        }
      }
    }
    return true
  }

  // Retorna uma copia do jogo atual
  getCopy() {
    var newJogo = new Jogo8(this.dimension)
    for (var i = 0; i < this.dimension; i++) {
      for (var j = 0; j < this.dimension; j++) {
        newJogo.borda[i][j] = this.borda[i][j]
      }
    }
    for (var i = 0; i < this.resolucao.length; i++) {
      newJogo.resolucao.push(this.resolucao[i])
    }
    return newJogo
  }
  // Retorna todos os movimentos possíveis
  getMovimentosPossiveis() {
    var movimentosPossiveis = []
    for (var i = 0; i < this.dimension; i++) {
      for (var j = 0; j < this.dimension; j++) {
        var num = this.borda[i][j]
        if (this.getMove(num) != null) {
          movimentosPossiveis.push(num)
        }
      }
    }
    return movimentosPossiveis
  }
  // visita um nó e retorna seus filhos
  visita() {
    var filhos = []
    var movimentosPossiveis = this.getMovimentosPossiveis()
    for (var i = 0; i < movimentosPossiveis.length; i++) {
      var move = movimentosPossiveis[i]
      if (move != this.lastMove) {
        var newJogo = this.getCopy()
        newJogo.move(move)
        newJogo.resolucao.push(move)
        filhos.push(newJogo)
      }
    }
    return filhos
  }
  buscaEmLargura() {
    var estadoInicial = this.getCopy()
    estadoInicial.resolucao = []
    var estados = [estadoInicial]
    while (estados.length > 0) {
      var estado = estados[0]
      estados.shift()
      if (estado.verificaObjetivo()) {
        console.log(estados.length)
        return estado.resolucao
      }
      estados = estados.concat(estado.visita())
    }
  }
  extend(arr, arr2) {
    arr2.forEach(element => {
      arr.unshift(element)
    })
    return arr
  }
  checkRepeat(estado) {
    var bool = false
    console.log(estado)
    var j
    for (var k = 0; k < Estado.repetidos.length; k++) {
      j = 0
      Estado.repetidos[k].borda.forEach(e => {
        console.log("LinhaR: " + e)
        console.log("Linha: " + estado.borda[j])
        var i = 0
        estado.borda[j].forEach(es => {
          console.log("Indice: " + i)
          console.log("EI: " + e[i] + " - " + "ES: " + es)
          if (e[i] != es) {
            bool = true
          }
          i += 1
        })
        j += 1
      })
      console.log(bool)
      if (bool === false) return false
    }
    return true
  }
  buscaEmProfundidade() {
    var estadoInicial = this.getCopy()
    estadoInicial.resolucao = []
    var estados = [estadoInicial]
    while (estados.length > 0) {
      while (this.checkRepeat(estados[0]) === false) estados.shift()
      var estado = estados[0]
      Estado.repetidos.push(estado)
      if (estado.verificaObjetivo()) {
        return estado.resolucao
      }
      estados = this.extend(estados, estado.visita())
      estados.pop()
    }
  }
  tam() {
    return this.resolucao.length
  }

  getDistanciaManhattan() {
    var distancia = 0
    for (var i = 0; i < this.dimension; i++) {
      for (var j = 0; j < this.dimension; j++) {
        var num = this.borda[i][j]
        if (num != 0) {
          var linhaOriginal = Math.floor((num - 1) / this.dimension)
          var colunaOriginal = (num - 1) % this.dimension
          distancia +=
            Math.abs(i - linhaOriginal) + Math.abs(j - colunaOriginal)
        }
      }
    }
    return distancia
  }

  buscaA() {
    console.log("Fazendo busca em A")

    var estados = new MinHeap(null, function(a, b) {
      return a.distancia - b.distancia
    })
    this.resolucao = []
    estados.push({ jogo: this, distancia: 0 })
    while (estados.size() > 0) {
      var estado = estados.pop().jogo
      if (estado.verificaObjetivo()) {
        return estado.resolucao
      }
      var filhos = estado.visita()
      for (var i = 0; i < filhos.length; i++) {
        var filho = filhos[i]
        var f = filho.tam() + filho.getDistanciaManhattan()
        estados.push({ jogo: filho, distancia: f })
      }
    }
  }
  resolve() {
    if (this.algoritmo == Algoritmo.LARGURA) {
      return this.buscaEmLargura()
    } else if (this.algoritmo == Algoritmo.PROFUNDIDADE) {
      return this.buscaEmProfundidade()
    } else {
      return this.buscaA()
    }
  }
}