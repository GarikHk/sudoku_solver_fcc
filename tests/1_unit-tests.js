const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const puzzles = require('../controllers/puzzle-strings.js');

let solver = new Solver();
let puzzle = puzzles.puzzlesAndSolutions[0][0];
let solution = puzzles.puzzlesAndSolutions[0][1];
let invalidPuzzle = '1a5aa2a84aa63a12a7a2aa5aaaaa9aa1aaaa8a2a3674a3a7a2aa9a47aaa8aa1aa16aaaa926914a37a';
let unsolvable = '1.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

suite('Unit Tests', () => {
  // #1
  test('1) Logic handles a valid puzzle string of 81 characters', () => {
    assert.isFalse(solver.validate(puzzle));
    assert.strictEqual(solver.solve(puzzle), solution);
  });

  // #2
  test('2) Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    assert.isObject(solver.validate(invalidPuzzle));
    assert.property(solver.validate(invalidPuzzle), 'error');
    assert.strictEqual(solver.validate(invalidPuzzle).error, 'Invalid characters in puzzle');
  });

  //#3
  test('3) Logic handles a puzzle string that is not 81 characters in length', () => {
    assert.isObject(solver.validate('0.0.0.0.0'));
    assert.property(solver.validate('0.0.0.0.0'), 'error');
    assert.strictEqual(solver.validate('0.0.0.0.0').error, 'Expected puzzle to be 81 characters long');
  });

  //#4
  test('4) Logic handles a valid row placement', () => {
    assert.isFalse(solver.checkRowPlacement(puzzle, 3, 1));
  });

  // #5
  test('5) Logic handles an invalid row placement', () => {
    assert.strictEqual(solver.checkRowPlacement(puzzle, 1, 1), 'row');
  });

  //#6
  test('6) Logic handles a valid col placement', () => {
    assert.isFalse(solver.checkColPlacement(puzzle, 2, 1));
  });

  // #7
  test('7) Logic handles an invalid col placement', () => {
    assert.strictEqual(solver.checkColPlacement(puzzle, 1, 1), 'column');
  });

  // #8
  test('8) Logic handles a valid region (3x3 grid) placement', () => {
    assert.isFalse(solver.checkRegionPlacement(puzzle, 2, 2, 3));
  });

  // #9
  test('9) Logic handles an invalid region (3x3 grid) placement', () => {
    assert.strictEqual(solver.checkRegionPlacement(puzzle, 2, 2, 1), 'region');
  });

  // #10
  test('10) Valid puzzle strings pass the solver', () => {
    for (let i = 0; i < puzzles.puzzlesAndSolutions.length; i++) {
      assert.strictEqual(solver.solve(puzzles.puzzlesAndSolutions[i][0]), puzzles.puzzlesAndSolutions[i][1]);
    }
  });

  // #11
  test('11) Invalid puzzle strings fail the solver', () => {
    assert.isFalse(solver.solve(unsolvable));
  });

  // #12
  test('12) Solver returns the expected solution for an incomplete puzzle', () => {
    assert.strictEqual(solver.solve(puzzle), solution);
  });
});
