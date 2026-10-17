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
  return Array.from({ length: TAMANHO }, (_, i) => {
    if (palavra[i] === palavraAlvo[i]) {
      return 'correta';
    }

    return palavraAlvo.includes(palavra[i]) ? 'presente' : 'ausente';
  });
};

export default palavras;
