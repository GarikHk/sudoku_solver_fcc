'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || !value) return res.json({ error: 'Required field(s) missing' });

      if (!/^[1-9]$/.test(value)) return res.json({ error: 'Invalid value' });

      const valid = solver.validate(puzzle);
      if (valid.hasOwnProperty('error')) return res.status(400).json(valid);

      const validCoordinate = solver.isValidCoordinate(coordinate);
      if (!validCoordinate) return res.json({ error: 'Invalid coordinate' });
      const { row, col } = validCoordinate;
      const index = (row - 1) * 9 + (col - 1)
      if (puzzle[index] == value) return res.json({ valid: true });

      const conflict = [];
      const rowConf = solver.checkRowPlacement(puzzle, row, value);
      const colConf = solver.checkColPlacement(puzzle, col, value);
      const regConf = solver.checkRegionPlacement(puzzle, row, col, value);

      if (rowConf) conflict.push(rowConf);
      if (colConf) conflict.push(colConf);
      if (regConf) conflict.push(regConf);

      if (conflict.length !== 0) {
        return res.json({
          valid: false,
          conflict: conflict,
        });
      } else {
        return res.json({ valid: true });
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      if (!puzzle) return res.status(400).json({ error: 'Required field missing' });

      const valid = solver.validate(puzzle);
      if (valid.hasOwnProperty('error')) return res.status(400).json(valid);

      const solution = solver.solve(puzzle);
      if (!solution) return res.status(400).json({ error: 'Puzzle cannot be solved' });
      return res.status(200).json({ solution });
    });
};
