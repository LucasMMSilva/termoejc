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

test('marca de amarelo todas as letras presentes, mesmo quando repetidas', () => {
  const resultado = avaliarPalavra('SASSO', 'SOUSA');
  assert.deepEqual(resultado, ['correta', 'presente', 'presente', 'correta', 'presente']);
});

test('marca de amarelo a letra repetida fora da posição correta', () => {
  const resultado = avaliarPalavra('CARRO', 'CEDRO');
  assert.deepEqual(resultado, ['correta', 'ausente', 'presente', 'correta', 'correta']);
});

test('marca em amarelo as letras presentes na posição errada', () => {
  const resultado = avaliarPalavra('DECRO', 'CEDRO');
  assert.deepEqual(resultado, ['presente', 'correta', 'presente', 'correta', 'correta']);
});

test('marca palavra correta totalmente', () => {
  const resultado = avaliarPalavra(PALAVRA_SECRETA, PALAVRA_SECRETA);
  assert.deepEqual(resultado, ['correta', 'correta', 'correta', 'correta', 'correta']);
});
