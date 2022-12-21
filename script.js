const speedAlert = document.getElementById("speed-alert");
const modal = document.getElementById("modal");
const infoPlayer = document.getElementById("info-player");

const typeSpeedAlert = {
  success: "success", 
  fail: "fail",
};

speedAlert.addEventListener("click", () => {
  speedAlert.style.opacity = 0;
});

// Função de speed alert
function showSpeedAlert(type, message) {
  speedAlert.setAttribute("data-type", type);
  speedAlert.innerText = message;

  speedAlert.style.opacity = 1;
  // Depois de 2s fechar automaticamente caso o usuário não clique para fehcar
  window.setTimeout(() => {
    speedAlert.style.opacity = 0;
  }, 5000);
};

function showModalWin(message) {
  document.getElementById("player-win-modal").innerText = message;
  modal.classList.add("show");
};

// Jogador 1 = 0
// Jogador 2 = 1
let jogadorVez = {
  value: -1,
  setValue: (value) => {
    jogadorVez.value = value;
    infoPlayer.innerText = (value + 1);
  },
  drawDandomPlayer: () => {
    jogadorVez.setValue(Math.floor(Math.random() * 2));
  },
};
// HOMOLOGAÇÂO - assumo que o jogador 0 é circulo e o jogador 1 é o xis
const rows = document.getElementsByClassName("row");
const cols = document.getElementsByClassName("col");
const elementPerRow = cols.length / rows.length;
for (let i = 0; i < cols.length; i++) 
  cols[i].addEventListener("click", function(e) {
    toggleItemSelect(cols[i]);
    // 
    cols[i].addEventListener("animationend", (e) => {
      cols[i].classList.remove("shake");
    });
  });

function toggleItemSelect(col) {
  // Posição já foi marcada 
  if (col.getAttribute("data-checked") == 'true') {
    col.classList.add("shake");
    return;
  }

  col.setAttribute("data-checked", (col.getAttribute("data-checked") != "true"));
  drawSelectItem(col);
  // Verificar vitoria de algum player 
  if (checkedWin()) { 
    const info = `Jogador ${jogadorVez.value + 1} ganhou!`;
    // Informar a vitoria de um jogador 
    showSpeedAlert(typeSpeedAlert.success, info);
    showModalWin(info);
  } else { // Jogo deve continuar 
    // Variar vez dos jogadores 
    jogadorVez.setValue(jogadorVez.value === 0? 1 : 0);
  }
};

function drawSelectItem(col) {
  if (col.firstChild) return;

  const image = document.createElement('img');
  image.width = col.clientWidth;
  image.height = col.clientHeight;
  image.padding = 20;
  image.classList.add("effect-select-item");
  // Jogador 1 - usa circulo para marcar 
  // Jogador 2 - usa  o xis para marcar
  image.src = jogadorVez.value == 0? "./images/circled-thin-90.png" : "./images/close-100.png";

  col.appendChild(image);
  col.setAttribute("data-player-checked", jogadorVez.value);
};

/*
function checkedWin() { 
  let win = false;
  // Analisando a vitoria na horizontal 
  for (let i = 0; i < rows.length; i++) {
    let tempWin = false;
    // Verificando cada celula da linha 
    for (let j = 0; j < rows[i].children.length; j++) {
      tempWin = rows[i].children[j].hasAttribute("data-checked") && 
        rows[i].children[j].getAttribute("data-checked") == "true" && 
        rows[i].children[j].hasAttribute("data-player-checked") && 
        rows[i].children[j].getAttribute("data-player-checked") == jogadorVez.value;
      // Se pelo menos uma celula da linha for falsa, a linha é invalidada 
      if (!tempWin) break;
    }
    // Definindo vitoria caso tenha ocorrido na horizontal 
    win = tempWin;
    // Verificar a vitoria na horizontal
    if (win) break;
  }

  // Caso a vitoria tenha sido garantida na horizontal não é necessário mais análises
  if (win) return true;

  // Analisando a vitoria na vertical 
  for (let i = 0; i < elementPerRow; i++) {
    let tempWin = false;
    // Verificando cada celula da coluna 
    for (let j = 0; j < rows.length; j++) {
      tempWin = rows[j].children[i].hasAttribute("data-checked") && 
        rows[j].children[i].getAttribute("data-checked") == "true" && 
        rows[j].children[i].hasAttribute("data-player-checked") &&
        rows[j].children[i].getAttribute("data-player-checked") == jogadorVez.value;
      // Se pelo menos uma celula da coluna for falsa, a coluna é invalidada
      if (!tempWin) break;
    }
    // Definindo vitoria caso tenha ocorrido na vertical 
    win = tempWin;
    if (win) break; 
  }

  // Caso a vitoria tenha sido garantida na vertical não é necessário mais análises
  if (win) return true;

  // Analisando a vitoria nas diagonais 
  // -----------------------------------
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < elementPerRow; j++) {
      let tempWin = false;
      if (
        rows[i].children[j].hasAttribute("data-checked") && 
        rows[i].children[j].getAttribute("data-checked") == "true" && 
        rows[i].children[j].hasAttribute("data-player-checked") && 
        rows[i].children[j].getAttribute("data-player-checked") == jogadorVez.value
      ) {
        tempWin = true;
        i++;
        // Verificar se não foi ultrapassado o range da repetição 
        if (i >= rows.length) break;
      }
      // Definindo vitoria caso tenha ocorrido na diagonal 
      win = tempWin; 
      if (!tempWin) break;
    }

    if (!win) break;
  }

  // Caso a vitoria tenha sido garantida na diagonal não é necessário mais análises
  if (win) return true;
  // -----------------------------------
  for (let i = 0; i < rows.length; i++) {
    for (let j = (elementPerRow - 1); j >= 0; j--) { 
      let tempWin = false;  
      if (
        rows[i].children[j].hasAttribute("data-checked") && 
        rows[i].children[j].getAttribute("data-checked") == "true" && 
        rows[i].children[j].hasAttribute("data-player-checked") && 
        rows[i].children[j].getAttribute("data-player-checked") == jogadorVez.value
      ) {
        tempWin = true;
        i++;
        // Verificar se não foi ultrapassado o range da repetição 
        if (i >= rows.length) break;
      }
      // Definindo vitoria caso tenha ocorrido na diagonal 
      win = tempWin;
      if (!tempWin) break;
    }

    if (!win) break;
  }

  // Caso a vitoria tenha sido garantida na diagonal não é necessário mais análises
  if (win) return true;
};
*/

function checkedWin() {
  // A quantidade máxima de pontos para declaração de vitória é a quantidade de elementos por linha 
  const maxPts = elementPerRow; 
  let win = false;

  function horizontal(irow, icol, tempPts = 0) {
    if (irow >= rows.length || irow < 0 || icol >= elementPerRow || icol < 0 || tempPts == maxPts) return tempPts;
    if (
      rows[irow].children[icol].hasAttribute("data-checked") && 
      rows[irow].children[icol].getAttribute("data-checked") == "true" && 
      rows[irow].children[icol].hasAttribute("data-player-checked") && 
      rows[irow].children[icol].getAttribute("data-player-checked") == jogadorVez.value
    ) 
      return horizontal(irow, ++icol, ++tempPts);
  }

  function vertical(irow, icol, tempPts = 0) {
    if (irow >= rows.length || irow < 0 || icol >= elementPerRow || icol < 0 || tempPts == maxPts) return tempPts;
    if (
      rows[irow].children[icol].hasAttribute("data-checked") && 
      rows[irow].children[icol].getAttribute("data-checked") == "true" && 
      rows[irow].children[icol].hasAttribute("data-player-checked") && 
      rows[irow].children[icol].getAttribute("data-player-checked") == jogadorVez.value
    ) 
      return vertical(++irow, icol, ++tempPts);
  }

  function diagonalRight(irow, icol, tempPts = 0) {
    if (irow >= rows.length || irow < 0 || icol >= elementPerRow || icol < 0 || tempPts == maxPts) return tempPts;
    if (
      rows[irow].children[icol].hasAttribute("data-checked") && 
      rows[irow].children[icol].getAttribute("data-checked") == "true" && 
      rows[irow].children[icol].hasAttribute("data-player-checked") && 
      rows[irow].children[icol].getAttribute("data-player-checked") == jogadorVez.value
    ) 
      return diagonalRight(++irow, ++icol, ++tempPts);
  }

  function diagonalLeft(irow, icol, tempPts = 0) {
    if (irow >= rows.length || irow < 0 || icol >= elementPerRow || icol < 0 || tempPts == maxPts) return tempPts;
    if (
      rows[irow].children[icol].hasAttribute("data-checked") && 
      rows[irow].children[icol].getAttribute("data-checked") == "true" && 
      rows[irow].children[icol].hasAttribute("data-player-checked") && 
      rows[irow].children[icol].getAttribute("data-player-checked") == jogadorVez.value
    ) 
      return diagonalLeft(++irow, --icol, ++tempPts);
  }

  for (let i = 0; i < rows.length && !win; i++) {
    for (let j = 0; j < rows[i].children.length && !win; j++) {
      if (
        rows[i].children[j].hasAttribute("data-checked") && 
        rows[i].children[j].getAttribute("data-checked") == "true" && 
        rows[i].children[j].hasAttribute("data-player-checked") && 
        rows[i].children[j].getAttribute("data-player-checked") == jogadorVez.value
      ) 
        win = horizontal(i, j) == maxPts || vertical(i, j) == maxPts || 
          diagonalRight(i, j) == maxPts || diagonalLeft(i, j) == maxPts;
    }
  }

  return win;
}

function resetGame(e) {
  modal.classList.remove("show");
  // Limpar todos os dados atribuidos 
  for (let i = 0; i < cols.length; i++) {
    cols[i].removeAttribute("data-checked");
    cols[i].removeAttribute("data-player-checked");
    // 
    if (cols[i].firstChild) {
      cols[i].removeChild(cols[i].firstChild);
    }
  };
  // Sortear um novo jogador
  jogadorVez.drawDandomPlayer();
};
document.getElementById("btn-reset-game").addEventListener("click", resetGame);
document.getElementById("btn-reset-game-modal").addEventListener("click", resetGame);
// Inicialização da aplicação 
(function init() { jogadorVez.drawDandomPlayer(); })();