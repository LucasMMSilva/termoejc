# projeto.md — Descubra o local

Jogo web mobile-first em React, inspirado no Termo. O jogador tem 6 tentativas para descobrir uma palavra de 5 letras. Ao acertar, descobre o local, o dia e o horário de um evento.

## Regra principal: manter simples

- **NÃO componentizar.** Todo o jogo fica em um único componente: `src/App.jsx`.
- Nada de pastas `components/`, `hooks/`, `context/`, `utils/` ou gerenciadores de estado (Redux, Zustand etc.).
- Apenas `useState`, `useEffect` e funções comuns dentro do `App.jsx`.
- Telas (jogo, vitória, derrota) são trocadas com renderização condicional no mesmo arquivo.
- Estilos em um único arquivo: `src/App.css`.
- Código direto, sem abstrações desnecessárias e sem bibliotecas extras.

## Stack

- React + Vite (JavaScript, não TypeScript)
- CSS puro (sem Tailwind, sem styled-components)
- `localStorage` para persistir a vitória

## Estrutura de arquivos

```
descubra-o-local/
├── index.html
├── CLAUDE.md
├── package.json
├── public/
│   └── conviteejc.png  # imagem do convite (baixada na tela de vitória)
└── src/
    ├── main.jsx        # só monta o <App />
    ├── App.jsx         # TODO o jogo
    ├── App.css         # TODOS os estilos
    └── palavras.js     # lista de palavras válidas (export default array)
```

## Dados do jogo

```js
const PALAVRA_SECRETA = "CEDRO";
const MAX_TENTATIVAS = 6;
const TAMANHO = 5;
const CHAVE_STORAGE = "descubra-o-local:vitoria";

const LOCAL = {
  local: "Parque Ecológico Cedro",
  dia: "24 de Outubro",
  horario: "16:00",
};
```

## Nome e textos

- Título do jogo: **Descubra o local**
- Mensagem de palavra inválida: **Essa palavra não existe**
- Tela de vitória: **Parabéns, você acertou!**
- Tela de derrota: **Você não conseguiu, perdeu!** + botão **Tente novamente**

## Telas

Controladas por um estado simples: `tela = "jogo" | "vitoria" | "derrota"`.

### 1. Jogo
- Título "Descubra o local" no topo.
- Grade de 6 linhas x 5 colunas.
- Teclado virtual na parte de baixo (A–Z, **ENTER** e **APAGAR**), adaptado para toque.
- Também aceitar teclado físico (letras, Enter, Backspace) via `useEffect` com `keydown`.
- Mensagem de erro temporária (aprox. 2 segundos) acima da grade.

### 2. Vitória
- Exibida ao acertar CEDRO.
- Texto: "Parabéns, você acertou!"
- Informações:
  - **Local:** Parque Ecológico Cedro
  - **Dia:** 24 de Outubro
  - **Horário:** 16:00
- Botão **Baixar convite**: baixa a imagem `conviteejc.png` (ver seção "Convite para download").
- Sem botão de jogar de novo (a vitória é permanente).

## Convite para download

- A imagem do convite se chama **`conviteejc.png`** e fica na pasta `public/` do projeto (`public/conviteejc.png`).
- O botão na tela de vitória é um link simples com o atributo `download`, sem JavaScript extra e sem componente separado:

```jsx
<a className="botao" href="/conviteejc.png" download="conviteejc.png">
  Baixar convite
</a>
```

- Estilizar o link com a classe `.botao` no `App.css` (azul `--correta`, texto claro, cantos arredondados, largura total, altura mínima de 48px para toque).
- Mostrar o botão apenas na tela de vitória, abaixo das informações do local.
- O arquivo da imagem será fornecido por mim; não gerar nem inventar a imagem.
- **A imagem `conviteejc.png` vai estar solta na raiz do projeto.** Ao iniciar o projeto, mova o arquivo para `public/conviteejc.png` (crie a pasta `public/` se ela não existir) e confirme que o link `/conviteejc.png` funciona. Não deixe uma cópia na raiz.

### 3. Derrota
- Exibida quando as 6 tentativas acabam sem acerto.
- Texto: "Você não conseguiu, perdeu!"
- Botão **Tente novamente**: zera tentativas, linha atual e cores do teclado, e volta para a tela de jogo.
- Não revelar o local aqui.

## Regras do jogo

1. O jogador digita 5 letras e envia com ENTER.
2. **Validação da palavra:** ao enviar, verificar se a palavra existe na língua portuguesa.
   - Comparar **sem acentos e sem diferenciar maiúsculas/minúsculas**. Palavra com acentuação incorreta continua válida.
   - Normalização: `palavra.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()`
   - A lista em `src/palavras.js` deve guardar as palavras **já normalizadas** (sem acento, maiúsculas), uma lista de palavras de 5 letras do português. Obrigatório incluir "CEDRO".
   - Se não existir na lista: mostrar "Essa palavra não existe", **não gastar tentativa** e manter as letras digitadas.
   - Enviar com menos de 5 letras: mostrar "Faltam letras" e não gastar tentativa.
3. Se a palavra for válida, avaliar as letras (comparando sempre versões normalizadas):
   - **correta**: letra certa na posição certa
   - **presente**: letra existe na palavra, mas em outra posição
   - **ausente**: letra não existe na palavra
   - Tratar letras repetidas corretamente: primeiro marcar as corretas, depois marcar as presentes respeitando a quantidade de ocorrências restantes.
4. Atualizar as cores do teclado virtual (prioridade: correta > presente > ausente).
5. Se a palavra enviada for igual a CEDRO: salvar vitória e ir para a tela de vitória.
6. Se esgotar as 6 tentativas sem acertar: ir para a tela de derrota.

## Persistência (localStorage)

- Ao vencer: `localStorage.setItem("descubra-o-local:vitoria", "true")`.
- Ao carregar o app: se a chave existir, iniciar **direto na tela de vitória** com os dados do local, sem mostrar o jogo.
- Implementação simples no estado inicial:

```js
const [tela, setTela] = useState(
  localStorage.getItem(CHAVE_STORAGE) === "true" ? "vitoria" : "jogo"
);
```

- Derrota **não** é salva. Recarregar a página volta ao jogo zerado.
- Envolver acessos ao `localStorage` em `try/catch`.

## Paleta de cores (azul)

Definir como variáveis CSS em `:root` no `App.css`:

```css
:root {
  --fundo: #0b1b3a;        /* azul marinho profundo */
  --fundo-card: #12295a;   /* painéis e tela de resultado */
  --borda: #2a4a8f;        /* bordas das casas vazias */
  --texto: #f1f6ff;
  --correta: #1e6fff;      /* azul vivo */
  --presente: #7cc4ff;     /* azul claro (texto escuro) */
  --ausente: #1b2a4d;      /* azul acinzentado escuro */
  --tecla: #2f4f9e;        /* teclas do teclado */
  --erro: #4aa3ff;         /* mensagem de aviso */
}
```

- Apenas tons de azul. Diferenciar correta/presente/ausente por luminosidade (vivo, claro, escuro).
- Texto das casas "presente" em azul escuro para manter contraste.

## Mobile first

- `index.html` com `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">`.
- Layout em coluna única, centralizado, `max-width: 480px`.
- Usar `height: 100dvh` (com fallback `100vh`) para o app caber na tela sem rolagem.
- Casas da grade quadradas, tamanho com `min()` / `vw` para caber em telas pequenas (ex.: `width: min(15vw, 60px)`).
- Teclas do teclado com altura mínima de 48px (área de toque confortável), `gap` pequeno e `touch-action: manipulation`.
- Desabilitar seleção de texto e o destaque de toque (`-webkit-tap-highlight-color: transparent`).
- Animações leves: virada das casas ao revelar e "tremida" na linha quando a palavra for inválida.
- Fontes em unidades relativas, fonte sem serifa do sistema.
- Testar em 360x640 e 390x844.

## Comandos

```bash
npm create vite@latest descubra-o-local -- --template react
cd descubra-o-local
npm install
npm run dev
npm run build
```

## Checklist de aceite

- [ ] Todo o código do jogo está em `App.jsx` (sem componentização)
- [ ] Paleta apenas azul
- [ ] Funciona bem no celular, sem rolagem e sem zoom
- [ ] Palavra inexistente mostra "Essa palavra não existe" e não gasta tentativa
- [ ] Palavra com acento incorreto é aceita
- [ ] Letras repetidas avaliadas corretamente
- [ ] Após 6 erros aparece a tela de derrota com o botão "Tente novamente"
- [ ] Acertar CEDRO mostra "Parabéns, você acertou!" com Local, Dia e Horário
- [ ] `conviteejc.png` foi movido da raiz para `public/`
- [ ] A tela de vitória tem o botão "Baixar convite" que baixa `conviteejc.png`
- [ ] A vitória fica salva e a tela de vitória aparece sempre ao reabrir a página
- [ ] O título "Descubra o local" aparece no jogo
