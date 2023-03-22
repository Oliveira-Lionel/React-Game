import HexagonIcon from '@mui/icons-material/Hexagon';
import React from "react";
import "../App.css";

interface HexBoardProps {}

interface HexBoardState {
  figurePositionsBlue: Array<{ row: number, col: number }>;
  figurePositionsRed: Array<{ row: number, col: number }>;
  selectedFigurePosition: { row: number; col: number } | null;
  selectedFigurePosition2: { row: number; col: number } | null;
  selectedFigurePosition3: { row: number; col: number } | null;
}

/* The actually HexagonBoard of the possible fields */
const boardRows: number[] = [5, 6, 7, 8, 9, 8, 7, 6, 5];

var turnBlue = true;

class HexBoard extends React.Component<HexBoardProps, HexBoardState> {
  /* Constructor, which places the initial figures in their correct position */
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
      selectedFigurePosition2: null,
      selectedFigurePosition3: null,
    };
  }

  /* Click Events */
  handleHexClick = (row: number, col: number) => {
    const { figurePositionsBlue, figurePositionsRed, selectedFigurePosition, selectedFigurePosition2, selectedFigurePosition3 } = this.state;

    /* Checks if the clicked Hexagon Field is the same has one of the already selected Figures */
    const selectionMatchesClicked = (selectedFigurePosition: { row: number; col: number } | null) => {
      return selectedFigurePosition && selectedFigurePosition.row === row && selectedFigurePosition.col === col;
    };

    /* For Blue's turn */
    if(turnBlue) {
      // If a figure is already selected
      // Remove Clicked selectedFigurePosition
      if (selectionMatchesClicked(selectedFigurePosition) || selectionMatchesClicked(selectedFigurePosition2) || selectionMatchesClicked(selectedFigurePosition3)) {
        if(selectionMatchesClicked(selectedFigurePosition3)) {
          this.setState({ 
            selectedFigurePosition3: null,
          });
        } else if(selectionMatchesClicked(selectedFigurePosition2) && !selectedFigurePosition3) {
          this.setState({ 
            selectedFigurePosition2: null,
          });
        } else if(selectionMatchesClicked(selectedFigurePosition2) && selectedFigurePosition3) {
          this.setState({ 
            selectedFigurePosition2: selectedFigurePosition3,
            selectedFigurePosition3: null,
          });
        } else if(selectionMatchesClicked(selectedFigurePosition) && !selectedFigurePosition2 && !selectedFigurePosition3) {
          this.setState({ 
            selectedFigurePosition: null,
          });
        } else if(selectionMatchesClicked(selectedFigurePosition) && selectedFigurePosition2 && !selectedFigurePosition3) {
          this.setState({ 
            selectedFigurePosition: selectedFigurePosition2,
            selectedFigurePosition2: null,
          });
        } else if(selectionMatchesClicked(selectedFigurePosition) && selectedFigurePosition2 && selectedFigurePosition3) {
          this.setState({ 
            selectedFigurePosition: selectedFigurePosition2,
            selectedFigurePosition2: selectedFigurePosition3,
            selectedFigurePosition3: null,
          });
        }
      }
      /* This whole if condition checks if the move can be made, and fulfills it in case it works */
      /* Needs Update */
      else if (selectedFigurePosition && this.isAdjacent(row, col, selectedFigurePosition.row, selectedFigurePosition.col)) {
          const isPositionTaken = figurePositionsBlue.some(pos => pos.row === row && pos.col === col)
            || figurePositionsRed.some(pos => pos.row === row && pos.col === col);

          if (!isPositionTaken) {
            // Find the figure's current position and remove it from the figurePositions array
            let newFigurePositionsBlue = figurePositionsBlue;
            let newFigurePositionsRed = figurePositionsRed;
            if (newFigurePositionsBlue.some(pos => pos.row === selectedFigurePosition.row && pos.col === selectedFigurePosition.col)) {
              newFigurePositionsBlue = newFigurePositionsBlue.filter(pos => !(pos.row === selectedFigurePosition.row && pos.col === selectedFigurePosition.col));
            }

            // Add the figure to the clicked position
            newFigurePositionsBlue.push({ row: row, col: col });

            // Update the state
            this.setState({
              figurePositionsBlue: newFigurePositionsBlue,
              figurePositionsRed: newFigurePositionsRed,
              selectedFigurePosition: null,
            });

            turnBlue = false;
        }
      } else {
        /* Needs Update */
        const clickedPositionBlue = figurePositionsBlue.find(pos => pos.row === row && pos.col === col);

        if(clickedPositionBlue) {

        }



        /* If Adjacent of already selected Figure is clicked, it is also selected */
        if( selectedFigurePosition && !this.isAdjacent(row, col, selectedFigurePosition.row, selectedFigurePosition.col)) {
          if (clickedPositionBlue) {
            this.setState({ 
              selectedFigurePosition2: clickedPositionBlue,
            });
          }
        }
        // If no figure is currently selected, select the clicked position if it contains a figure
        else {
          if (clickedPositionBlue) {
            this.setState({ 
              selectedFigurePosition: clickedPositionBlue,
            });
          }
        }
      }
    } 
    /* For Red's turn */
    else {
      // If a figure is already selected
      if (selectedFigurePosition && selectedFigurePosition.row === row && selectedFigurePosition.col === col) {
        this.setState({ 
          selectedFigurePosition: null,
        });
      }
      else if (selectedFigurePosition && this.isAdjacent(row, col, selectedFigurePosition.row, selectedFigurePosition.col)) {
        const isPositionTaken = figurePositionsBlue.some(pos => pos.row === row && pos.col === col)
          || figurePositionsRed.some(pos => pos.row === row && pos.col === col);

        if (!isPositionTaken) {
          // Find the figure's current position and remove it from the figurePositions array
          let newFigurePositionsBlue = figurePositionsBlue;
          let newFigurePositionsRed = figurePositionsRed;
          if (newFigurePositionsRed.some(pos => pos.row === selectedFigurePosition.row && pos.col === selectedFigurePosition.col)) {
            newFigurePositionsRed = newFigurePositionsRed.filter(pos => !(pos.row === selectedFigurePosition.row && pos.col === selectedFigurePosition.col));
          }

          // Add the figure to the clicked position
          newFigurePositionsRed.push({ row: row, col: col });

          // Update the state
          this.setState({
            figurePositionsBlue: newFigurePositionsBlue,
            figurePositionsRed: newFigurePositionsRed,
            selectedFigurePosition: null,
          });

          turnBlue = true;
        }
      }
      // If no figure is currently selected, select the clicked position if it contains a figure
      else {
        const clickedPositionRed = figurePositionsRed.find(pos => pos.row === row && pos.col === col);

        if (clickedPositionRed) {
          this.setState({ selectedFigurePosition: clickedPositionRed });
        }
      }
    }
  };

  /* Checks if the new position (row1 & col1) is adjacent with the previous selected figure's position (row2 & col2) */
  isAdjacent = (row1: number, col1: number, row2: number, col2: number) => {
    var adjacent = false;
    if(row2 <= 3) {
      if(Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1) {
        adjacent = true;
        if(Math.abs(row1 - row2) === 1 && Math.abs(col1 - col2) === 1) {
          if(row2 - row1 !== col2 - col1)
            adjacent = false;
        }
      }
    }
    else if(row2 === 4) {
      if(Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1) {
        adjacent = true;
        if(Math.abs(row1 - row2) === 1 && Math.abs(col1 - col2) === 1) {
          if((col2 - col1) === -1)
            adjacent = false;
        }
      }
    } else {
      if(Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1) {
        adjacent = true;
        if(Math.abs(row1 - row2) === 1 && Math.abs(col1 - col2) === 1) {
          if(row2 - row1 === col2 - col1) {
            adjacent = false;
          }
        }
      }
    }
    return (
      adjacent
    );
  };

  render() {
    const { figurePositionsBlue, figurePositionsRed, selectedFigurePosition, selectedFigurePosition2, selectedFigurePosition3 } = this.state;
    return (
      <div className="hexboard-container">
        <div className="hexboard">
          {boardRows.map((numHexagons, i) => {
            const hexagons = Array.from({ length: numHexagons }, (_, j) => {
              /*  */
              const isFigureAndBlue = figurePositionsBlue.some(pos => pos.row === i && pos.col === j);
              const isFigureAndRed = figurePositionsRed.some(pos => pos.row === i && pos.col === j);
              const isFigureAndSelected = selectedFigurePosition?.row === i && selectedFigurePosition?.col === j;
              const isFigureAndSelected2 = selectedFigurePosition2?.row === i && selectedFigurePosition2?.col === j;
              const isFigureAndSelected3 = selectedFigurePosition3?.row === i && selectedFigurePosition3?.col === j;

              /* Shows the user, which moves he can do after having clicked on a Figure */
              const possibleMoves: {row: number, col: number}[] = [];

              if(selectedFigurePosition) {
                for (let i = 0; i < boardRows.length; i++) {
                  for (let j = 0; j < boardRows[i]; j++) {
                    if(this.isAdjacent(selectedFigurePosition?.row, selectedFigurePosition?.col, i, j) && !isFigureAndBlue && !isFigureAndRed)
                      possibleMoves.push({row: i, col: j});
                  }
                }
              }

              const isPossibleMoves = possibleMoves.some(pos => pos.row === i && pos.col === j);
              const isSelected = this.state.selectedFigurePosition && this.state.selectedFigurePosition.row === i && this.state.selectedFigurePosition.col === j;
              return (
                <div
                  key={`${i}-${j}`}
                  className={`hexagon-wrapper${isSelected ? ' selected' : ''}`}//className="hexagon-wrapper"
                  /*onClick={() => this.handleHexClick(i, j)}*/
                  onClick={() => this.handleHexClick(i, j)}
                >
                  <HexagonIcon className="hexagon" style={{ fontSize: "120px", color: "#F58900" }} /*id={`hex-${i}-${j}`}*/ />
                  {isFigureAndBlue && (
                    <div className="circle" style={{ backgroundColor: "blue" }} />
                  )}
                  {isFigureAndRed && (
                    <div className="circle" style={{ backgroundColor: "red" }} />
                  )}
                  {isFigureAndSelected && (
                    <div className="circle" style={{ backgroundColor: "green" }} />
                  )}
                  {isFigureAndSelected2 && (
                    <div className="circle" style={{ backgroundColor: "rose" }} />
                  )}
                  {isFigureAndSelected3 && (
                    <div className="circle" style={{ backgroundColor: "violet" }} />
                  )}
                  {isPossibleMoves && (
                    <div className="circle" style={{ backgroundColor: "gray" }} />
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