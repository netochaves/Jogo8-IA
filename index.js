class Jogo8GUI {
  constructor($container) {
    this.$container = $container
    this.dimensao = 3
    this.tamanho = 50
    this.margem = 10
    this.velocidade = 100
    this.trocas = 10
    this.jogo = new Jogo8(this.dimensao)
    this.ultimoTabuleiro = []
    this.desenha()
    var self = this
    var Gerar = function() {
      $container
        .parent()
        .find("#gerar")
        .attr("disabled", "disabled")
      $container
        .parent()
        .find("#resolver")
        .attr("disabled", "disabled")
      self.geraAleatorio(self.jogo, self.trocas, function() {
        $container
          .parent()
          .find("#gerar")
          .removeAttr("disabled")
        $container
          .parent()
          .find("#resolver")
          .removeAttr("disabled")
      })
    }
    $container
      .parent()
      .find("#gerar")
      .on("click", Gerar)
    Gerar()
    $container
      .parent()
      .find("#resolver")
      .on("click", function() {
        $container.parent().find("#tempo")
        var start_time = new Date()
        var resposta = self.jogo.resolve()
        var time = (new Date() - start_time) / 1000.0
        $container
          .parent()
          .find("#tempo")
          .html(time)
        $container
          .parent()
          .find("#gerar")
          .attr("disabled", "disabled")
        $container
          .parent()
          .find("#resolver")
          .attr("disabled", "disabled")
        self.resolve(self.jogo, resposta, function() {
          $container
            .parent()
            .find("#gerar")
            .removeAttr("disabled")
          $container
            .parent()
            .find("#resolver")
            .removeAttr("disabled")
        })
      })
    // move um número ao clicar nele
    $container.find("div").on("click", function() {
      var id = $(this).attr("id")
      var num = parseInt(id.slice(1))
      var direction = self.jogo.move(num)
      if (direction != null) {
        self.move(id, direction)
      }
    })
  }
  // desenha os números
  desenha() {
    for (var i = 0; i < this.dimensao; i++) {
      for (var j = 0; j < this.dimensao; j++) {
        if (!(i == this.dimensao - 1 && j == this.dimensao - 1)) {
          var id = i * this.dimensao + j + 1
          this.$container.append("<div id='c" + id + "'>" + id + "</div>")
          var $e = this.$container.find("#c" + id)
          $e.css("left", j * (this.tamanho + this.margem))
          $e.css("top", i * (this.tamanho + this.margem))
          $e.css("width", this.tamanho + "px")
          $e.css("height", this.tamanho + "px")
          $e.css("font-size", this.tamanho * 0.7)
        }
      }
      this.$container.append("<br/>")
    }
    this.$container.css("width", (this.tamanho + this.margem) * this.dimensao)
    this.$container.css("height", (this.tamanho + this.margem) * this.dimensao)
  }
  //move um numero
  move(id, direction) {
    var block = this.$container.find("#" + id)
    var distance = this.tamanho + this.margem
    switch (direction) {
      case Direction.LEFT:
        block.animate(
          {
            left: "-=" + distance + "px"
          },
          this.velocidade
        )
        break
      case Direction.RIGHT:
        block.animate(
          {
            left: "+=" + distance + "px"
          },
          this.velocidade
        )
        break
      case Direction.UP:
        block.animate(
          {
            top: "-=" + distance + "px"
          },
          this.velocidade
        )
        break
      case Direction.DOWN:
        block.animate(
          {
            top: "+=" + distance + "px"
          },
          this.velocidade
        )
        break
    }
  }
  randomMove(jogo, lastMove) {
    var movimentosPossiveis = jogo.getMovimentosPossiveis()
    var rand
    do {
      rand = Math.floor(Math.random() * movimentosPossiveis.length)
    } while (lastMove == movimentosPossiveis[rand])
    var movendo = movimentosPossiveis[rand]
    var direcao = jogo.move(movendo)
    this.move("c" + movendo, direcao)
    return movendo
  }
  geraAleatorio(jogo, times, callbackFunction, lastMove) {
    if (times <= 0) {
      callbackFunction()
      return
    }
    var move = this.randomMove(jogo, lastMove)
    var self = this
    setTimeout(function() {
      self.geraAleatorio(jogo, times - 1, callbackFunction, move)
    }, this.velocidade)
  }
  resolve(jogo, resposta, callbackFunction) {
    if (resposta === false) return false
    if (resposta.length == 0) {
      callbackFunction()
      return
    }
    var movingBlock = resposta.shift()
    var direction = jogo.move(movingBlock)
    this.move("c" + movingBlock, direction)
    var self = this
    setTimeout(function() {
      self.resolve(jogo, resposta, callbackFunction)
    }, this.velocidade)
  }
}
