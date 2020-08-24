import React, {useState} from 'react';
import styled from 'styled-components';


// coordinated are stored [y, x]
// board[0, 0] is top left of board

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
}

function determineCheckerColor(rowIndex) {
  if (rowIndex < 3) {
    return 'white'
  } else if (rowIndex > 4) {
    return 'blue'
  }
}

function determineSquareColor(props) {
  let rowIndex = props.row_index;
  let columnIndex = props.column_index;
  if (matchingCoordinates(props.allValidMoves, [rowIndex, columnIndex])) {
    return '#FF6EC7'
  }
  return ((rowIndex + columnIndex) % 2 === 0) ? '#dfd0c0' : 'black';
}

function matchingCoordinates(coordinatesToMatch, coordinate) {
  const matches = (coordinatePair) => (coordinatePair[0] === coordinate[0] && coordinatePair[1] === coordinate[1]);

  return coordinatesToMatch.some(matches)
}

function createRow(rowIndex, board, setBoard, setPlayerTurn, playerOneTurn) {
  const allValidMoves = findValidMoves(board)

  return (
    <BoardRow>
      {
        board.map(
          (_, columnIndex) => (
            <Square row_index={rowIndex} column_index={columnIndex}
                    onClick={function () {
                      updateBoard(board, rowIndex, columnIndex, setBoard, setPlayerTurn, playerOneTurn);
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
}

function isSelecting(board) {
  const allRows = board.flat()
  const selected = (checker) => checker && checker.selected;
  return allRows.some(selected)
}

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
}

function updateBoard(board, rowIndex, colIndex, setBoard, setPlayerTurn, playerOneTurn) {
  // const [newRowIndex, newColIndex] = movePiece(rowIndex, colIndex)
  // let square = board[rowIndex][colIndex]

  const newBoard = board.map((row) => {
    return row.slice()
  })

  if (isSelecting(board)) {
    // selectedRowIndex = rowIndex of selected (highlighted) checker
    // selectedColIndex = colIndex of selected (highlighted) checker
    // rowIndex = rowIndex of the square youre trying to move to
    // colIndex = colIndex of the square youre trying to move to
    const [selectedRowIndex, selectedColIndex] = findSelectedIndices(board)
    const selectedChecker = board[selectedRowIndex][selectedColIndex]
    const validMoves = findValidMoves(board)
    if (matchingCoordinates(validMoves, [rowIndex, colIndex])) {
      // checker is being moved here
      newBoard[rowIndex][colIndex] = selectedChecker
      newBoard[selectedRowIndex][selectedColIndex] = null

      const potentialSecondMoves = findValidMoves(newBoard)

      if (Math.abs(selectedColIndex - colIndex) === 1 || Math.abs(selectedRowIndex - rowIndex) === 1)  {
        setPlayerTurn(!playerOneTurn)
        selectedChecker.selected = false
      } else if (potentialSecondMoves.length === 0) {
        setPlayerTurn(!playerOneTurn)
        selectedChecker.selected = false
      } else if (potentialSecondMoves.length > 0) {
        debugger
        const anyJumpingMoves = potentialSecondMoves.some((coordinatePair) => {
          return Math.abs(coordinatePair[0] - colIndex ) > 1 && Math.abs(coordinatePair[1] - rowIndex) > 1
        })
        if (anyJumpingMoves) {
        } else {
          selectedChecker.selected = false
        }
      }

      if (checkForJumpedPieces(selectedRowIndex, selectedColIndex, rowIndex, colIndex)) {
        const rowIndexDiff = selectedRowIndex + rowIndex
        const colIndexDiff = selectedColIndex + colIndex
        newBoard[rowIndexDiff / 2][colIndexDiff / 2] = null
      }
    } else {
      selectedChecker.selected = false
    }
  } else if (newBoard[rowIndex][colIndex] != null) {
    newBoard[rowIndex][colIndex].selected = true
  }
  setBoard(newBoard)
}

function setPlayerTurn() {

}

function checkForJumpedPieces(selectedRowIndex, selectedColIndex, rowIndex, colIndex) {
  return Math.abs(selectedRowIndex - rowIndex) > 1 || Math.abs(selectedColIndex - colIndex) > 1;
}


function findValidMoves(board) {
  if (isSelecting(board)) {
    const possibleValidMoves = []
    const [selectedRowIndex, selectedColIndex] = findSelectedIndices(board)
    const selectedChecker = board[selectedRowIndex][selectedColIndex]
    const yMovementIncrement = selectedChecker.color === 'white' ? 1 : -1

    // this contains all possible moves, including those off the board
    possibleValidMoves.push([selectedRowIndex + yMovementIncrement, selectedColIndex - 1])
    possibleValidMoves.push([selectedRowIndex + yMovementIncrement, selectedColIndex + 1])

    // this filters to only valid moves, confining moves to within  the board
    const filteredValidMoves = possibleValidMoves.filter(
      coordinates => coordinates[0] >= 0 && coordinates[0] <= 7 && coordinates[1] >= 0 && coordinates[1] <= 7
    )
    console.log(board)
    // create new array
    // iterate through filteredValidMoves
    // push the valid moves into another array, validMoves
    const validMoves = []

    filteredValidMoves.forEach((adjacentCoordinatePair) => {
        // if the checker location provided by coordinatePair is empty
        if (board[adjacentCoordinatePair[0]][adjacentCoordinatePair[1]] == null) {
          validMoves.push(adjacentCoordinatePair)
        } else {
          const adjacentCheckerCoordinatePair = adjacentCoordinatePair
          const xMovementIncrement = adjacentCheckerCoordinatePair[1] - selectedColIndex
          const adjacentCoordinatePairCopy = adjacentCoordinatePair.slice()
          adjacentCoordinatePairCopy[1] += xMovementIncrement
          adjacentCoordinatePairCopy[0] += yMovementIncrement

          // if (coordinatePairCopy[0] === undefined) {debugger}
          if (board[adjacentCoordinatePairCopy[0]][adjacentCoordinatePairCopy[1]] == null && board[adjacentCoordinatePair[0]][adjacentCoordinatePair[1]].color !== selectedChecker.color){
            validMoves.push(adjacentCoordinatePairCopy)
          } else {
          }
        }
      }
    )
    return validMoves
  }
  return []
}

const App = () => {
  let checkerboard = newGame(initialBoard);

  const [board, setBoard] = useState(checkerboard);
  const [playerOneTurn, setPlayerTurn] = useState(true);

  return (
    <Table>
      {board.map((_, index) => (
        createRow(index, board, setBoard, setPlayerTurn, playerOneTurn)
      ))
      }
      {`It is PlayerOne's turn ` + playerOneTurn}
    </Table>
  )
};

export default App;
