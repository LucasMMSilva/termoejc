import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizarPalavra,
  verificarTentativa,
  avaliarPalavra,
  PALAVRA_SECRETA,
} from './gameLogic.js';

test('normaliza palavra com acento e caixa', () => {
  assert.equal(normalizarPalavra('cédro'), 'CEDRO');
  assert.equal(normalizarPalavra('cÉdRo'), 'CEDRO');
});

test('aceita palavra válida em português', () => {
  const resultado = verificarTentativa('cÉdRo');
  assert.equal(resultado.valido, true);
  assert.equal(resultado.palavra, PALAVRA_SECRETA);
});

test('rejeita palavra inexistente sem limpar o estado atual', () => {
  const resultado = verificarTentativa('ZZZZZ');
  assert.equal(resultado.valido, false);
  assert.equal(resultado.mensagem, 'Essa palavra não existe');
});

test('avalia letras repetidas corretamente', () => {
  const resultado = avaliarPalavra('SASSO', 'SOUSA');
  assert.deepEqual(resultado, ['correta', 'presente', 'ausente', 'correta', 'presente']);
});

test('marca palavra correta totalmente', () => {
  const resultado = avaliarPalavra(PALAVRA_SECRETA, PALAVRA_SECRETA);
  assert.deepEqual(resultado, ['correta', 'correta', 'correta', 'correta', 'correta']);
});
