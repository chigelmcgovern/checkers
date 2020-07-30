import React from 'react';
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
  background-color: ${(props) => (props.color)};
  border-radius: 50%;
`;

let initialBoard = new Array(8).fill(new Array(8).fill(null));

let checker = {
  color: '',
  isKing: '',
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
  return ((rowIndex + columnIndex) % 2 === 0) ? '#dfd0c0' : 'black';
};

function createRow(rowIndex, board) {
  return (
    <BoardRow>
      {
        BoardRowIndices.map(
          (columnIndex) => (
            <Square row_index={rowIndex} column_index={columnIndex}>
              {(!!board[rowIndex][columnIndex]) ? <Checker color={board[rowIndex][columnIndex].color}/> : null}
            </Square>
          )
        )
      }
    </BoardRow>
  )
};

const App = () => {
  let board = newGame(initialBoard);
  return (
    <table>
      {BoardRowIndices.map((index) => (
        createRow(index, board)
      ))
      }
    </table>
  )
};

export default App;
