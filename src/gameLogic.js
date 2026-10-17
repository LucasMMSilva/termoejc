import palavras from './palavras.js';

export const PALAVRA_SECRETA = 'CEDRO';
export const MAX_TENTATIVAS = 5;
export const TAMANHO = 5;

export const normalizarPalavra = (valor) =>
  String(valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();

export const verificarTentativa = (valor, listaPalavras = palavras) => {
  const palavra = normalizarPalavra(valor);

  if (palavra.length < TAMANHO) {
    return { valido: false, mensagem: 'Faltam letras' };
  }

  if (!listaPalavras.includes(palavra)) {
    return { valido: false, mensagem: 'Essa palavra não existe' };
  }

  return { valido: true, mensagem: '', palavra };
};

export const avaliarPalavra = (palavra, palavraAlvo = PALAVRA_SECRETA) => {
  const resultado = Array(TAMANHO).fill('ausente');
  const restantes = {};

  for (let i = 0; i < TAMANHO; i += 1) {
    const letraAlvo = palavraAlvo[i];

    if (palavra[i] === letraAlvo) {
      resultado[i] = 'correta';
    } else {
      restantes[letraAlvo] = (restantes[letraAlvo] || 0) + 1;
    }
  }

  for (let i = 0; i < TAMANHO; i += 1) {
    if (resultado[i] === 'correta') {
      continue;
    }

    const letra = palavra[i];
    if (restantes[letra] > 0) {
      resultado[i] = 'presente';
      restantes[letra] -= 1;
    }
  }

  return resultado;
};

export default palavras;
