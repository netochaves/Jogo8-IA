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

    var disable = function() {
      $container
        .parent()
        .find("#gerar")
        .attr("disabled", "disabled")
      $container
        .parent()
        .find("#resolver")
        .attr("disabled", "disabled")
    }
    var removeDisable = function() {
      $container
        .parent()
        .find("#gerar")
        .removeAttr("disabled")
      $container
        .parent()
        .find("#resolver")
        .removeAttr("disabled")
    }
    var details = function(i, time, algoritmo, nos, custo) {
      $container
        .parent()
        .find("#details" + i)
        .html(
          "<h3>Busca:" +
            algoritmo +
            "</h3><br />" +
            "Tempo gasto: " +
            time +
            "ms" +
            "<br />" +
            "Número de nos gerados: " +
            nos +
            "<br />" +
            "Custo da solução: " +
            custo
        )
    }
    var removeDetails = function() {
      $container
        .parent()
        .find("#details0")
        .html("")
      $container
        .parent()
        .find("#details1")
        .html("")
      $container
        .parent()
        .find("#details2")
        .html("")
    }
    var Gerar = function() {
      disable()
      self.geraAleatorio(self.jogo, self.trocas, function() {
        removeDisable()
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
        var algoritmo = $("#algoritmos").val()
        $container.parent().find("#tempo")
        if (algoritmo === "todos") {
          removeDetails()
          var start_time1 = new Date()
          var profundidade = self.jogo.resolve("PROFUNDIDADE")
          var time1 = (new Date() - start_time1) / 1000.0
          var num_nos1 = profundidade[1]
          details(0, time1, "Profundidade", num_nos1, profundidade[0].length)
          var start_time2 = new Date()
          var largura = self.jogo.resolve("LARGURA")
          var time2 = (new Date() - start_time2) / 1000.0
          var num_nos2 = largura[1]
          details(1, time2, "Largura", num_nos2, largura[0].length)
          var start_time3 = new Date()
          var a = self.jogo.resolve("A")
          var time3 = (new Date() - start_time3) / 1000.0
          var num_nos3 = a[1]
          details(2, time3, "A*", num_nos3, a[0].length)
          disable()
          self.resolve(self.jogo, a[0], function() {
            removeDisable()
          })
        } else {
          var start_time = new Date()
          var resposta = self.jogo.resolve(algoritmo)
          var time = (new Date() - start_time) / 1000.0
          disable()
          removeDetails()
          $container
            .parent()
            .find("#details1")
            .html(
              "Busca: " +
                algoritmo +
                "<br />" +
                "Tempo gasto: " +
                time +
                "<br />" +
                "Número de nos gerados: " +
                resposta[1] +
                "<br />" +
                "Custo da solução: " +
                resposta[0].length
            )
          self.resolve(self.jogo, resposta[0], function() {
            removeDisable()
          })
        }
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
