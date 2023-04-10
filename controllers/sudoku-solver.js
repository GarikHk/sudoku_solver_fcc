// index => { row, col }
function i2rc(index) {
  return { row: Math.floor(index / 9), col: index % 9 };
}

// { row, col } => index
function rc2i(row, col) {
  return row * 9 + col;
}

class SudokuSolver {

  validate(puzzleString) {
    const regex = /^[1-9\.]+$/;

    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    };

    if (!regex.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    };
    return false;
  }

  isValidCoordinate(coordinate) {
    const regex = /^[A-I][1-9]$/;

    if (!regex.test(coordinate)) {
      return false;
    }

    const row = coordinate.charCodeAt(0) - 65 + 1;
    const col = parseInt(coordinate.charAt(1));
    return { row, col };
  }

  checkRowPlacement(puzzleString, row, value) {
    for (let c = 0; c < 9; ++c) {
      if (puzzleString[rc2i(row - 1, c)] == value) {
        return 'row';
      };
    };
    return false;
  }

  checkColPlacement(puzzleString, column, value) {
    for (let r = 0; r < 9; ++r) {
      if (puzzleString[rc2i(r, column - 1)] == value) {
        return 'column';
      };
    };
    return false;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let r1 = Math.floor((row - 1) / 3) * 3;
    let c1 = Math.floor((column - 1) / 3) * 3;

    for (let r = r1; r < r1 + 3; ++r) {
      for (let c = c1; c < c1 + 3; ++c) {
        if (puzzleString[rc2i(r, c)] == value){
          return 'region';
        };
      };
    };
    return false;
  }

  solve(puzzleString) {
    const board = puzzleString.replace(/\./g, 0).split('').map(i => parseInt(i));

    const getChoices = (board, index) => {
      let choices = [];
      for (let value = 1; value <= 9; ++value) {
        if (acceptable(board, index, value)) {
          if (unique(board, index, value)) return [value];
          else choices.push(value);
        };
      };
      return choices;
    };

    const unique = (board, index, value) => {
      let { row, col } = i2rc(index);
      let r1 = Math.floor(row / 3) * 3;
      let c1 = Math.floor(col / 3) * 3;

      for (let r = r1; r < r1 + 3; ++r) {
        for (let c = c1; c < c1 + 3; ++c) {
          let i = rc2i(r, c);
          if (i != index && !board[i] && acceptable(board, i, value)) return false;
        };
      };
      return true;
    };

    const acceptable = (board, index, value) => {
      let { row, col } = i2rc(index);

      for (let r = 0; r < 9; ++r)
        if (board[rc2i(r, col)] == value) return false;

      for (let c = 0; c < 9; ++c)
        if (board[rc2i(row, c)] == value) return false;

      let r1 = Math.floor(row / 3) * 3;
      let c1 = Math.floor(col / 3) * 3;
      for (let r = r1; r < r1 + 3; ++r) {
        for (let c = c1; c < c1 + 3; ++c) {
          if (board[rc2i(r, c)] == value) return false;
        };
      };

      return true;
    };

    const bestBet = (board) => {
      let index, moves, bestLen = 100;
      for (let i = 0; i < 81; ++i) {
        if (!board[i]) {
          let m = getChoices(board, i);
          if (m.length < bestLen) {
            bestLen = m.length;
            moves = m;
            index = i;
            if (bestLen == 0) break;
          };
        };
      };
      return { index, moves };
    };

    const puzzleSolve = () => {
      let { index, moves } = bestBet(board);
      if (index == null) return true;

      for (let m of moves) {
        board[index] = m;
        if (puzzleSolve()) return true;
      };

      board[index] = 0;  //backtrack
      return false;
    };

    //...8.1..........435............7.8........1...2..3....6......75..34........2..6..
    if (puzzleSolve()) {
      return board.join('');
    } else {
      return false;
    };
  };
}

module.exports = SudokuSolver;

