import { useEffect, useState } from 'react';
import './App.css';
import Board from './components/Board';
import Square from './components/Square';

//icon
import chicken from './img/chicken.png';
import success from './img/success.png';
import gettogether from './img/gettogether.png';

function App() {

  const [squares, setSquares] = useState(()=>{
    return new Array(9).fill(null)
  });

  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false); // hoà nhau
  const [restart, setRestart] = useState(false);

  const squaresEmpty = squares
  .map((square, index) => square === null ? index : null )
  .filter(square => square !== null);

  // console.log(squaresEmpty);

  const handleSquareClick = (index) => {
    const isPlayerTurn = squares.filter(square => square !== null).length % 2 === 0;
    const checkSquareNotPutted = squaresEmpty.filter(item => item === index).length == 1;
    if(isPlayerTurn && checkSquareNotPutted) {
      const newSquares = squares;
      newSquares[index] = 'x';
      setSquares([...newSquares]);
    }
  }

  const linesWin = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6],
  ]

  useEffect(()=>{
    if(squares.filter(square => square === null).length === 0) { // check hoà nhau
      setDraw(true);
      setRestart(true);
      return;
    }

    const isComputerTurn = squares.filter(square => square !== null).length % 2 === 1;

    // console.log("----------------");

    const linesThatAre = (a, b, c) => {
      return linesWin.filter(squareIndexes => {
        const squareValues = squareIndexes.map(index => {
          // console.log(index);
          // console.log(squares[index]);
          return squares[index];
        });
        // console.log(squareValues);
        return JSON.stringify([a, b, c].sort()) === JSON.stringify(squareValues.sort());
      });
    }

    const playerWin = linesThatAre('x', 'x', 'x').length > 0;
    const computerWin = linesThatAre('o', 'o', 'o').length > 0;

    if(computerWin) {
      setWinner('o');
      setRestart(true);
      return;
    }

    if(playerWin) {
      setWinner('x');
      setRestart(true);
      return;
    }
    
    const computerPut = (index) => {
      const newSquares = squares;
      newSquares[index] = 'o';
      setSquares([...newSquares]);
    }
    
    if(isComputerTurn) {

      const winningLines = linesThatAre('o', 'o', null);
      if(winningLines.length > 0) {
        const winIndex = winningLines[0].filter(index => squares[index] === null);
        computerPut(winIndex);
        return;
      }

      const lineToBlock = linesThatAre('x', 'x', null);
      if(lineToBlock.length > 0) {
        const blockIndex = lineToBlock[0].filter(index => squares[index] === null);
        computerPut(blockIndex);
        return;
      }

      const randomIndex = squaresEmpty[Math.ceil(Math.random() * squares.length)];
      computerPut(randomIndex);
    }

  }, [squares])

  const handleRestart = () => {
    window.location.reload();
  }

  return (
    <main>
      <h1>Caro Game</h1>
      <Board>
        {
          squares.map((square, index)=>{
            return(
              <Square 
                x = {square === 'x' ? 1 : 0}
                o = {square === 'o' ? 1 : 0}
                key={index}
                onClick = {()=>handleSquareClick(index)}
              />
            )
          })
        }
      </Board>
      {
        draw 
        ?
        <h1 className='result draw'>
          Draw
          <img className='icon' src={gettogether} />
        </h1>
        :
        (
      
          (winner === 'x' && (
            <h1 className='result win'>
              You Win
              <img className='icon' src={success} />
            </h1>
          ))
          ||
          (winner === 'o' && (
            <h1 className='result lost'>
              Computer Win
              <img className='icon' src={chicken} />
            </h1>
          ))
        )
      }

      {restart && (
        <button className='btn-restart' onClick={()=>{handleRestart()}}>
          Restart game
        </button>
      )
      }
    </main>
  );
}

export default App;
