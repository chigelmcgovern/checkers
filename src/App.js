import React, {useState} from 'react';
import styled from 'styled-components';

const BoardRowIndices = [...Array(8).keys()]

const BoardRow = styled.div`
  &:after{}
  max-width: 600px;
  font-family: "Comic Sans MS", sans-serif;
  margin: auto;
  clear: both;
  display: table-row;
`;

const Table = styled.table`
  border-collapse: collapse;
`

const Square = styled.div`
  background-color: ${determineSquareColor};
  display: table-cell;
  border: 1px solid grey;
  font-size: 12px;
  font-weight: bold;
  line-height: 34px;
  height: 64px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 64px;
  vertical-align: middle;
`;

const Checker = styled.div`
  height: 25px;
  width: 25px;
  margin: auto;
  background-color: ${(props) => (props.selected ? '#39ff14' : props.color)};
  border-radius: 50%;
`;

let initialBoard = new Array(8).fill(new Array(8).fill(null));

let checker = {
  color: '',
  isKing: '',
  selected: false
};

function newGame(board) {
  return board.map((row, rowIndex) => {
      return row.map((_, columnIndex) => {
        if ((rowIndex + columnIndex) % 2 === 1) {
          if ([3, 4].includes(rowIndex)) {
            return null
          }
          return {
            isKing: false,
            color: determineCheckerColor(rowIndex)
          }
        }
      })
    }
  )
};

function determineCheckerColor(rowIndex) {
  if (rowIndex < 3) {
    return 'white'
  } else if (rowIndex > 4) {
    return 'blue'
  }
};

function determineSquareColor(props) {
  let rowIndex = props.row_index;
  let columnIndex = props.column_index;
  if (matchingCoordinates(props.allValidMoves, [rowIndex, columnIndex])) {
    return '#FF6EC7'
  }
  return ((rowIndex + columnIndex) % 2 === 0) ? '#dfd0c0' : 'black';

};

function matchingCoordinates(coordinatesToMatch, coordinate) {
  const matches = (coordinatePair) => (coordinatePair[0] === coordinate[0] && coordinatePair[1] === coordinate[1]);

  return coordinatesToMatch.some(matches)
}

function createRow(rowIndex, board, setBoard) {
  const allValidMoves = findValidMoves(board)

  return (
    <BoardRow>
      {
        board.map(
          (_, columnIndex) => (
            <Square row_index={rowIndex} column_index={columnIndex}
                    onClick={function () {
                      updateBoard(board, rowIndex, columnIndex, setBoard);
                    }}
                    allValidMoves={allValidMoves}
            >
              {(!!board[rowIndex][columnIndex]) ? <Checker
                color={board[rowIndex][columnIndex].color}
                selected={board[rowIndex][columnIndex].selected}
              /> : null}
            </Square>
          )
        )
      }
    </BoardRow>
  )
};

function isSelecting(board) {
  const allRows = board.flat()
  const selected = (checker) => checker && checker.selected;
  return allRows.some(selected)
};

function findSelectedIndices(board) {
  let selectedRowIndex;
  let selectedColIndex;
  board.forEach((row, rowIndex) => {
    row.forEach((checker, colIndex) => {
      if (checker && checker.selected) {
        selectedRowIndex = rowIndex
        selectedColIndex = colIndex
      }
    })
  })
  return [selectedRowIndex, selectedColIndex]
};

function updateBoard(board, rowIndex, colIndex, setBoard) {
  // const [newRowIndex, newColIndex] = movePiece(rowIndex, colIndex)
  // let square = board[rowIndex][colIndex]

  const newBoard = board.map((row) => {
    return row.slice()
  })

  if (isSelecting(board)) {
    const [selectedRowIndex, selectedColIndex] = findSelectedIndices(board)
    const selectedChecker = board[selectedRowIndex][selectedColIndex]
    const validMoves = findValidMoves(board)
    if (matchingCoordinates(validMoves, [rowIndex, colIndex])) {
      newBoard[rowIndex][colIndex] = selectedChecker
      newBoard[selectedRowIndex][selectedColIndex] = null
      selectedChecker.selected = false
    }
  } else {
    newBoard[rowIndex][colIndex].selected = true
  }
  ;

  setBoard(newBoard)
};

function findValidMoves(board) {
  if (isSelecting(board)) {
    const possibleValidMoves = []
    const [selectedRowIndex, selectedColIndex] = findSelectedIndices(board)
    const selectedChecker = board[selectedRowIndex][selectedColIndex]
    const movementIncrement = selectedChecker.color === 'white' ? 1 : -1

    possibleValidMoves.push([selectedRowIndex + movementIncrement, selectedColIndex - 1])
    possibleValidMoves.push([selectedRowIndex + movementIncrement, selectedColIndex + 1])

    const validMoves = possibleValidMoves.filter(
      coordinates => coordinates[0] >= 0 && coordinates[0] <= 7 && coordinates[1] >= 0 && coordinates[1] <= 7
    )
    return validMoves
  } else {
    return []
  }
};

const App = () => {
  let checkerboard = newGame(initialBoard);

  const [board, setBoard] = useState(checkerboard);

  return (
    <Table>
      {board.map((_, index) => (
        createRow(index, board, setBoard)
      ))
      }
    </Table>
  )
};

export default App;
