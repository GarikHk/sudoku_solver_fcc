const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzles = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

let puzzle = puzzles.puzzlesAndSolutions[0][0];
let solution = puzzles.puzzlesAndSolutions[0][1];
let invalidPuzzle = '1a5aa2a84aa63a12a7a2aa5aaaaa9aa1aaaa8a2a3674a3a7a2aa9a47aaa8aa1aa16aaaa926914a37a';
let unsolvable = '1.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

suite('Functional Tests', () => {
  // #1
  test('1) Solve a puzzle with valid puzzle string: POST request to /api/solve', done => {
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: puzzle,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'solution');
        assert.strictEqual(res.body.solution, solution);
        done();
      });
  });

  // #2
  test('2) Solve a puzzle with missing puzzle string: POST request to /api/solve', done => {
    chai
      .request(server)
      .post('/api/solve')
      .end((err, res) => {
        assert.equal(res.status, 400);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.strictEqual(res.body.error, 'Required field missing');
        done();
      });
  });

  // #3
  test('3) Solve a puzzle with invalid characters: POST request to /api/solve', done => {
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: invalidPuzzle,
      })
      .end((err, res) => {
        assert.equal(res.status, 400);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.strictEqual(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  // #4
  test('4) Solve a puzzle with incorrect length: POST request to /api/solve', done => {
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: '0..0.0.00.0',
      })
      .end((err, res) => {
        assert.equal(res.status, 400);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.strictEqual(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  // #5
  test('5) Solve a puzzle that cannot be solved: POST request to /api/solve', done => {
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle: unsolvable,
      })
      .end((err, res) => {
        assert.equal(res.status, 400);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.strictEqual(res.body.error, 'Puzzle cannot be solved');
        done();
      });
  });

  // #6
  test('6) Check a puzzle placement with all fields: POST request to /api/check', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: 'C1',
        value: 7,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'valid');
        assert.isTrue(res.body.valid);
        done();
      });
  });

  // #7
  test('7) Check a puzzle placement with single placement conflict: POST request to /api/check', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: 'C3',
        value: 7,
      })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.property(res.body, 'valid');
        assert.property(res.body, 'conflict');
        assert.isFalse(res.body.valid);
        assert.strictEqual(res.body.conflict.length, 1);
        done();
      });
  });

  // #8
  test('8) Check a puzzle placement with multiple placement conflicts: POST request to /api/check', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: 'B2',
        value: 1,
      })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.property(res.body, 'valid');
        assert.property(res.body, 'conflict');
        assert.isFalse(res.body.valid);
        assert.isAbove(res.body.conflict.length, 1);
        done();
      });
  });

  // #9
  test('9) Check a puzzle placement with all placement conflicts: POST request to /api/check', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: 'B1',
        value: 1,
      })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.property(res.body, 'valid');
        assert.property(res.body, 'conflict');
        assert.isFalse(res.body.valid);
        assert.isAbove(res.body.conflict.length, 1);
        done();
      });
  });

  // #10
  test('10) Check a puzzle placement with missing required fields: POST request to /api/check', done => {
    chai
    .request(server)
    .post('/api/check')
    .send({
      value: 1,
    })
    .end((err, res) => {
      assert.isObject(res.body);
      assert.property(res.body, 'error');
      assert.strictEqual(res.body.error, 'Required field(s) missing');
      done();
    });
  });

  // #11
  test('11) Check a puzzle placement with invalid characters: POST request to /api/check', done => {
    chai
    .request(server)
    .post('/api/check')
    .send({
      puzzle: invalidPuzzle,
      coordinate: 'A1',
      value: 1,
    })
    .end((err, res) => {
      assert.equal(res.status, 400);
      assert.isObject(res.body);
      assert.property(res.body, 'error');
      assert.strictEqual(res.body.error, 'Invalid characters in puzzle');
      done();
    });
  });

  // #12
  test('12) Check a puzzle placement with incorrect length: POST request to /api/check', done => {
    chai
    .request(server)
    .post('/api/check')
    .send({
      puzzle: '0.0.0.0.0.0',
      coordinate: 'A1',
      value: 1,
    })
    .end((err, res) => {
      assert.equal(res.status, 400);
      assert.isObject(res.body);
      assert.property(res.body, 'error');
      assert.strictEqual(res.body.error, 'Expected puzzle to be 81 characters long');
      done();
    });
  });

  // #13
  test('13) Check a puzzle placement with invalid placement coordinate: POST request to /api/check', done => {
    chai
    .request(server)
    .post('/api/check')
    .send({
      puzzle: puzzle,
      coordinate: 'Hello World!',
      value: 1,
    })
    .end((err, res) => {
      assert.isObject(res.body);
      assert.property(res.body, 'error');
      assert.strictEqual(res.body.error, 'Invalid coordinate');
      done();
    });
  });

  // #14
  test('14) Check a puzzle placement with invalid placement value: POST request to /api/check', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: 'A1',
        value: 77,
      })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.strictEqual(res.body.error, 'Invalid value');
        done();
      });
  });
});

