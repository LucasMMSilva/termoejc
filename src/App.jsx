import { useEffect, useState } from "react";
import {
  PALAVRA_SECRETA,
  MAX_TENTATIVAS,
  TAMANHO,
  avaliarPalavra,
  normalizarPalavra,
  verificarTentativa,
} from "./gameLogic";

const CHAVE_STORAGE = "descubra-o-local:vitoria";

const LOCAL = {
  local: "Parque Ecológico CEDRO",
  data: "24 de Outubro",
  horario: "16:00",
};

const PRIORIDADE = {
  correta: 3,
  presente: 2,
  ausente: 1,
};

const obterTelaInicial = () => {
  try {
    return localStorage.getItem(CHAVE_STORAGE) === "true" ? "vitoria" : "jogo";
  } catch {
    return "jogo";
  }
};

function App() {
  const [tela, setTela] = useState(obterTelaInicial);
  const [palavraAtual, setPalavraAtual] = useState("");
  const [tentativas, setTentativas] = useState(Array(MAX_TENTATIVAS).fill(""));
  const [resultado, setResultado] = useState(
    Array(MAX_TENTATIVAS)
      .fill(null)
      .map(() => Array(TAMANHO).fill(""))
  );
  const [linhaAtual, setLinhaAtual] = useState(0);
  const [teclas, setTeclas] = useState({});
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    if (!mensagem) {
      return undefined;
    }

    const timer = setTimeout(() => setMensagem(""), 2000);
    return () => clearTimeout(timer);
  }, [mensagem]);

  useEffect(() => {
    if (tela !== "jogo") {
      return undefined;
    }

    const handleKeyDown = (event) => {
      const tecla = event.key;

      if (/^[a-zA-ZÀ-ÖØ-Þà-öø-ÿ]$/.test(tecla)) {
        event.preventDefault();
        const letra = normalizarPalavra(tecla).slice(0, 1);
        if (palavraAtual.length < TAMANHO) {
          setPalavraAtual((atual) => `${atual}${letra}`);
        }
        return;
      }

      if (tecla === "Enter") {
        event.preventDefault();
        const resultadoValidacao = verificarTentativa(palavraAtual);

        if (!resultadoValidacao.valido) {
          setMensagem(resultadoValidacao.mensagem);
          setPalavraAtual("");
          return;
        }

        const avaliacao = avaliarPalavra(resultadoValidacao.palavra);
        const novasTentativas = [...tentativas];
        novasTentativas[linhaAtual] = resultadoValidacao.palavra;
        setTentativas(novasTentativas);

        const novosResultados = [...resultado];
        novosResultados[linhaAtual] = avaliacao;
        setResultado(novosResultados);

        const proximoTeclado = { ...teclas };
        avaliacao.forEach((status, index) => {
          const letra = resultadoValidacao.palavra[index];
          const atual = proximoTeclado[letra];
          if (!atual || PRIORIDADE[status] > PRIORIDADE[atual]) {
            proximoTeclado[letra] = status;
          }
        });
        setTeclas(proximoTeclado);

        if (resultadoValidacao.palavra === PALAVRA_SECRETA) {
          try {
            localStorage.setItem(CHAVE_STORAGE, "true");
          } catch {
            // ignora erro de storage
          }
          setTela("vitoria");
          return;
        }

        if (linhaAtual + 1 >= MAX_TENTATIVAS) {
          setTela("derrota");
          return;
        }

        setLinhaAtual((atual) => atual + 1);
        setPalavraAtual("");
      }

      if (tecla === "Backspace") {
        event.preventDefault();
        setPalavraAtual((atual) => atual.slice(0, -1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [linhaAtual, palavraAtual, resultado, teclas, tentativas, tela]);

  const adicionarLetra = (letra) => {
    if (tela !== "jogo") {
      return;
    }

    if (palavraAtual.length >= TAMANHO) {
      return;
    }

    setPalavraAtual((atual) => `${atual}${normalizarPalavra(letra).slice(0, 1)}`);
  };

  const enviarPalavra = () => {
    if (tela !== "jogo") {
      return;
    }

    const resultadoValidacao = verificarTentativa(palavraAtual);

    if (!resultadoValidacao.valido) {
      setMensagem(resultadoValidacao.mensagem);
      setPalavraAtual("");
      return;
    }

    const avaliacao = avaliarPalavra(resultadoValidacao.palavra);
    const novasTentativas = [...tentativas];
    novasTentativas[linhaAtual] = resultadoValidacao.palavra;
    setTentativas(novasTentativas);

    const novosResultados = [...resultado];
    novosResultados[linhaAtual] = avaliacao;
    setResultado(novosResultados);

    const proximoTeclado = { ...teclas };
    avaliacao.forEach((status, index) => {
      const letra = resultadoValidacao.palavra[index];
      const atual = proximoTeclado[letra];
      if (!atual || PRIORIDADE[status] > PRIORIDADE[atual]) {
        proximoTeclado[letra] = status;
      }
    });
    setTeclas(proximoTeclado);

    if (resultadoValidacao.palavra === PALAVRA_SECRETA) {
      try {
        localStorage.setItem(CHAVE_STORAGE, "true");
      } catch {
        // ignora erro de storage
      }
      setTela("vitoria");
      return;
    }

    if (linhaAtual + 1 >= MAX_TENTATIVAS) {
      setTela("derrota");
      return;
    }

    setLinhaAtual((atual) => atual + 1);
    setPalavraAtual("");
  };

  const apagarLetra = () => {
    if (tela !== "jogo") {
      return;
    }

    setPalavraAtual((atual) => atual.slice(0, -1));
  };

  const reiniciarJogo = () => {
    setTentativas(Array(MAX_TENTATIVAS).fill(""));
    setResultado(Array(MAX_TENTATIVAS).fill(null).map(() => Array(TAMANHO).fill("")));
    setLinhaAtual(0);
    setPalavraAtual("");
    setTeclas({});
    setMensagem("");
    setTela("jogo");
  };

  const linhasTeclado = ["ABCDEFGHI", "JKLMNOPQR", "STUVWXYZ"];

  return (
    <div className="app-shell">
      {tela === "jogo" && (
        <div className="panel game-panel">
          <header className="topo">
            <span className="mini-titulo">💙Encontro dos Azulzinhos💙</span>
            <h1>Descubra o local</h1>
          </header>

          {mensagem && <p className="mensagem-erro">{mensagem}</p>}

          <div className={`grade ${mensagem ? "linha-erro" : ""}`}>
            {Array.from({ length: MAX_TENTATIVAS }).map((_, index) => {
              const palavraExibida = index === linhaAtual ? palavraAtual : tentativas[index];
              const letrasResultado = resultado[index] || Array(TAMANHO).fill("");

              return (
                <div key={`linha-${index}`} className={`linha ${mensagem ? "linha-erro" : ""}`}>
                  {Array.from({ length: TAMANHO }).map((__, coluna) => {
                    const letra = palavraExibida[coluna] || "";
                    const estado = letrasResultado[coluna] || "";

                    return (
                      <div
                        key={`casa-${index}-${coluna}`}
                        className={`casa ${letra ? "preenchida" : ""} ${estado ? `status-${estado}` : ""}`}
                      >
                        {letra}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div className="teclado">
            {linhasTeclado.map((linha) => (
              <div key={linha} className="linha-teclado">
                {linha.split("").map((letra) => (
                  <button
                    key={letra}
                    type="button"
                    className={`tecla ${teclas[letra] ? `status-${teclas[letra]}` : ""}`}
                    onClick={() => adicionarLetra(letra)}
                  >
                    {letra}
                  </button>
                ))}
              </div>
            ))}

            <div className="linha-teclado linha-teclado-acao">
              <button type="button" className="tecla tecla-acao" onClick={enviarPalavra}>
                ENTER
              </button>
              <button type="button" className="tecla tecla-acao" onClick={apagarLetra}>
                APAGAR
              </button>
            </div>
          </div>
        </div>
      )}

      {tela === "vitoria" && (
        <div className="resultado">
          <header className="topo topo-resultado">
            <span className="mini-titulo">Evento confirmado</span>
            <h1>Descubra o local</h1>
          </header>

          <div className="card">
            <p>Oi, filhos! 💙</p>

            <p>
              Finalmente chegou o nosso tão esperado pós-EJC! Estamos contando os dias para
              ter vocês pertinho da gente e reviver cada momento que fez nosso coração tão
              feliz. Que sorte a nossa poder viver tudo isso mais uma vez, agora com vocês!
              💙
            </p>

            <p>AQUI FOI SÓ O COMEÇO…</p>

            <ul className="lista-detalhes">
              <li>
                <strong>Local:</strong> {LOCAL.local}
              </li>
              <li>
                <strong>Data:</strong> {LOCAL.data}
              </li>
              <li>
                <strong>Horário:</strong> {LOCAL.horario}
              </li>
            </ul>

            <a className="botao" href="/conviteejc.png" download="conviteejc.png">
              Baixar convite
            </a>
          </div>
        </div>
      )}

      {tela === "derrota" && (
        <div className="resultado">
          <header className="topo topo-resultado">
            <span className="mini-titulo">Mais uma tentativa</span>
            <h1>Descubra o local</h1>
          </header>

          <div className="card">
            <h2>Você não conseguiu, perdeu!</h2>
            <button type="button" className="botao" onClick={reiniciarJogo}>
              Tente novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
