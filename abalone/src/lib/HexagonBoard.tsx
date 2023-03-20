import HexagonIcon from '@mui/icons-material/Hexagon';
import React from "react";
import "../App.css";

interface HexBoardProps {}

interface HexBoardState {
  figurePositionsBlue: Array<{ row: number, col: number }>;
  figurePositionsRed: Array<{ row: number, col: number }>;
  selectedFigurePosition: { row: number; col: number } | null;
}

const boardRows: number[] = [5, 6, 7, 8, 9, 8, 7, 6, 5];

class HexBoard extends React.Component<HexBoardProps, HexBoardState> {
  constructor(props: HexBoardProps) {
    super(props);

    var desc = false;
    var col = 0;
    var max_col = 5;

    const figurePositionsBlue: {row: number, col: number}[] = [];

    const figurePositionsRed: {row: number, col: number}[] = [];

    const triple_col = (col: number) => {
      return (2 <= col && col <= 4);
    };

    for (let row = 0; row < 9; row++) {
      while(col < max_col) {
        if(row === 7 || row === 8 || (row === 6 && triple_col(col))) {
          figurePositionsBlue.push({row: row, col: col});
        }
        if(row === 0 || row === 1 || (row === 2 && triple_col(col))) {
          figurePositionsRed.push({row: row, col: col});
        }
        col++;
      }

      if(desc)
        max_col--
      else
        max_col++
      col = 0;
      if(max_col === 9)
        desc=true;
    }

    this.state = {
      figurePositionsBlue: figurePositionsBlue,
      figurePositionsRed: figurePositionsRed,
      selectedFigurePosition: null,
    };
  }

  /*handleHexClick = (row: number, col: number) => {
    this.setState({
      figurePositions: [row, col],
    });
  };*/

  render() {
    const { figurePositionsBlue, figurePositionsRed } = this.state;
    return (
      <div className="hexboard-container">
        <div className="hexboard">
          {boardRows.map((numHexagons, i) => {
            const hexagons = Array.from({ length: numHexagons }, (_, j) => {
              const isFigureAndBlue = figurePositionsBlue.some(pos => pos.row === i && pos.col === j);/*figurePosition && figurePosition[0] === i && figurePosition[1] === j;*/
              const isFigureAndRed = figurePositionsRed.some(pos => pos.row === i && pos.col === j);
              return (
                <div
                  key={`${i}-${j}`}
                  className="hexagon-wrapper"
                  /*onClick={() => this.handleHexClick(i, j)}*/
                >
                  <HexagonIcon className="hexagon" style={{ fontSize: "120px" }} id={`hex-${i}-${j}`} />
                  {isFigureAndBlue && (
                    <div className="circle" style={{ backgroundColor: "blue" }} />
                  )}
                  {isFigureAndRed && (
                    <div className="circle" style={{ backgroundColor: "red" }} />
                  )}
                </div>
              );//<HexagonIcon className="hexagon" style={{ color: hexagonColor }} />
            });//const element = document.getElementById('figure-1-2');
            return <div className="row" key={i}>{hexagons}</div>;//const hexagon = document.getElementById("hex-1-2");
          })}
        </div>
      </div>
    );
  }
}
    
export default HexBoard;
/*
.App {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
*/
/* Hexagon Setup */
/*.hexagon-board {
  font-size: 100px;*/
  /*display: flex;*/
  /*flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.hexagon-piece {
  color: blue;
  position: relative;
  cursor: pointer;
  transition: color 0.3s ease;
}

.hexagon-piece:hover {
  color: red;
}*/

/*
.chessboard {
  width: 400px;
  height: 400px;
  display: flex;
  flex-wrap: wrap;
  border: 1px solid black; *//* add a border to the container *//*
}

.square {
  width: 50px;
  height: 50px;
}

.light {
  background-color: #f0d9b5;
}

.dark {
  background-color: #b58863;
}*/
/*
.hexboard-container {
  min-width: 940px;
  min-height: 800px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  background-color: #EBE79B;
}

.row {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hexagon-wrapper {
  display: flex;
  margin-top: -18px;
  margin-bottom: -21px;
  margin-left: -22px;
  margin-right: -4px;
}

.circle {
  z-index: 1;
  position: absolute;
  border-radius: 50%;
  width: 50px;
  height: 50px;
}

.title {
  color: #F58900;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5em;;
}

.hexagon {
  transform: rotate(30deg);
  color: #F58900;
  display: flex;
  position: relative;
  left: 9px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #000000;
}*/