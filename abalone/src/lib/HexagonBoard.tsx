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

    var col = 1;
    var max_col = 6;

    const figurePositionsBlue: {row: number, col: number}[] = [];
    const figurePositionsRed: {row: number, col: number}[] = [];

    /* Indicate the correct positions for the figures */
    for (let row = 1; row < 10; row++) {
      while(col < max_col) {
        if(row === 8 || row === 9 || (row === 7 && (5 <= col && col <= 7))) {
          figurePositionsBlue.push({row: row, col: col});
        }
        if(row === 1 || row === 2 || (row === 3 && (3 <= col && col <= 5))) {
          figurePositionsRed.push({row: row, col: col});
        }
        col++;
      }
      max_col++
      col = 0;
    }

    /* Insert figures to the correct positions */
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

    /*if(turnBlue) {
      this.clickEventsBothPlayers(row, col, figurePositionsBlue);
      turnBlue = false;
    } else {
      this.clickEventsBothPlayers(row, col, figurePositionsRed);
      turnBlue = true;
    }*/

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
            selectedFigurePosition2: null,
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
      else if (selectedFigurePosition && this.checkPossibleMoves(row, col, selectedFigurePosition.row, selectedFigurePosition.col)) {
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
              selectedFigurePosition2: null,
            });

            turnBlue = false;
        }
      } else {
        /* Needs Update */
        const clickedPositionBlue = figurePositionsBlue.find(pos => pos.row === row && pos.col === col);

        if(clickedPositionBlue) {
          if(selectedFigurePosition && selectedFigurePosition2 && selectedFigurePosition3 && this.isThirdSelection(row, col, selectedFigurePosition2.row, selectedFigurePosition2.col, selectedFigurePosition3.row, selectedFigurePosition3.col)) {
            this.setState({ 
              selectedFigurePosition: selectedFigurePosition2,
              selectedFigurePosition2: selectedFigurePosition3,
              selectedFigurePosition3: clickedPositionBlue,
            });
          } else if(selectedFigurePosition && selectedFigurePosition2 && this.isThirdSelection(row, col, selectedFigurePosition.row, selectedFigurePosition.col, selectedFigurePosition2.row, selectedFigurePosition2.col)) {
            if(row > selectedFigurePosition.row) {
              this.setState({ 
                selectedFigurePosition3: selectedFigurePosition2,
                selectedFigurePosition2: selectedFigurePosition,
                selectedFigurePosition: clickedPositionBlue,
              });
            } else if(col > selectedFigurePosition.col && row === selectedFigurePosition.row) {
              this.setState({ 
                selectedFigurePosition3: selectedFigurePosition2,
                selectedFigurePosition2: selectedFigurePosition,
                selectedFigurePosition: clickedPositionBlue,
              });
            } else if(row > selectedFigurePosition2.row) {
              this.setState({ 
                selectedFigurePosition3: selectedFigurePosition2,
                selectedFigurePosition2: clickedPositionBlue,
              });
            } else if(col > selectedFigurePosition2.col && row === selectedFigurePosition2.row) {
              this.setState({ 
                selectedFigurePosition3: selectedFigurePosition2,
                selectedFigurePosition2: clickedPositionBlue,
              });
            } else {
              this.setState({ 
                selectedFigurePosition3: clickedPositionBlue,
              });
            }
          } else if(selectedFigurePosition && this.isAdjacent(row, col, selectedFigurePosition.row, selectedFigurePosition.col)) {
            if(row > selectedFigurePosition.row) {
              this.setState({ 
                selectedFigurePosition2: selectedFigurePosition,
                selectedFigurePosition: clickedPositionBlue,
                selectedFigurePosition3: null,
              });
            } else if(col > selectedFigurePosition.col) {
              this.setState({ 
                selectedFigurePosition2: selectedFigurePosition,
                selectedFigurePosition: clickedPositionBlue,
                selectedFigurePosition3: null,
              });
            } else {
              this.setState({ 
                selectedFigurePosition2: clickedPositionBlue,
                selectedFigurePosition3: null,
              });
            }
          } else {
            this.setState({ 
              selectedFigurePosition: clickedPositionBlue,
              selectedFigurePosition2: null,
              selectedFigurePosition3: null,
            });
          }
        }
      }
    }
    /* For Red's turn */
    /* Needs Update (after finishing blue's turn) */
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

  /*clickEventsBothPlayers(row: number, col: number, figurePositions: Array<{ row: number, col: number }>) {
    const { selectedFigurePosition, selectedFigurePosition2, selectedFigurePosition3 } = this.state;

    /* Checks if the clicked Hexagon Field is the same has one of the already selected Figures */
    /*const selectionMatchesClicked = (selectedFigurePosition: { row: number; col: number } | null) => {
      return selectedFigurePosition && selectedFigurePosition.row === row && selectedFigurePosition.col === col;
    };

    /* For Blue's turn */
    /*if(turnBlue) {
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
      /*else if (selectedFigurePosition && this.checkPossibleMoves(row, col, selectedFigurePosition.row, selectedFigurePosition.col)) {
          const isPositionTaken = figurePositions.some(pos => pos.row === row && pos.col === col)
            || figurePositions.some(pos => pos.row === row && pos.col === col);

          if (!isPositionTaken) {
            // Find the figure's current position and remove it from the figurePositions array
            let newFigurePositions = figurePositions;
            if (newFigurePositions.some(pos => pos.row === selectedFigurePosition.row && pos.col === selectedFigurePosition.col)) {
              newFigurePositions = newFigurePositions.filter(pos => !(pos.row === selectedFigurePosition.row && pos.col === selectedFigurePosition.col));
            }

            // Add the figure to the clicked position
            newFigurePositions.push({ row: row, col: col });

            if(turnBlue) {
              // Update the state
              this.setState({
                figurePositionsBlue: newFigurePositions,
                selectedFigurePosition: null,
                selectedFigurePosition2: null,
              });
            } else {
              // Update the state
              this.setState({
                figurePositionsRed: newFigurePositions,
                selectedFigurePosition: null,
                selectedFigurePosition2: null,
              });
            }
            // Update the state
            /*this.setState({
              figurePositionsBlue: newFigurePositionsBlue,
              figurePositionsRed: newFigurePositionsRed,
              selectedFigurePosition: null,
              selectedFigurePosition2: null,
            });*/
        /*}
      } else {
        /* Needs Update */
        /*const clickedPositionBlue = figurePositions.find(pos => pos.row === row && pos.col === col);

        if(clickedPositionBlue) {
          if(selectedFigurePosition && selectedFigurePosition2 && this.isThirdSelection(row, col, selectedFigurePosition.row, selectedFigurePosition.col, selectedFigurePosition2.row, selectedFigurePosition2.col)) {
            this.setState({ 
              selectedFigurePosition3: clickedPositionBlue,
            });
          }
          else if(selectedFigurePosition && this.isAdjacent(row, col, selectedFigurePosition.row, selectedFigurePosition.col)) {
            this.setState({ 
              selectedFigurePosition2: clickedPositionBlue,
            });
          } else {
            this.setState({ 
              selectedFigurePosition: clickedPositionBlue,
            });
          }
        }
      }
    } 
  }*/

  /* Checks if the new position (row1 & col1) is adjacent with the previous selected figure's position (row2 & col2) */
  isAdjacent = (row1: number, col1: number, row2: number, col2: number) => {
    var adjacent = false;
    /*if(row2 <= 3) {*/
    if((Math.abs(row2 - row1) <= 1 && Math.abs(col2 - col1) <= 1) && !((Math.abs(row2 - row1) === 1 && Math.abs(col2 - col1) === 1) && (row2 - row1 !== col2 - col1))) {
      adjacent = true;
    }
    /*}
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
    }*/
    return (
      adjacent
    );
  };

  isThirdSelection(row: number, col: number, sRow1: number, sCol1: number, sRow2: number, sCol2: number) {
    var possibleSelection = false;

    if(sRow1 === sRow2 && sCol1-1 === sCol2) {
      /* Selection of a third figure, which is horizontal ( - ) */
      if((sRow1 === row && sCol1+1 === col) || (sRow2 === row && sCol2-1 === col)) {
        possibleSelection = true;
      }
    } else if(sRow1-1 === sRow2 && sCol1-1 === sCol2) {
      /* Selection of a third figure, which is diagonal from bottom right to top left ( \ ) */
      if((sRow1+1 === row && sCol1+1 === col) || (sRow2-1 === row && sCol2-1 === col)) {
        possibleSelection = true;
      }
    } else if(sRow1-1 === sRow2 && sCol1 === sCol2) {
      /* Selection of a third figure, which is diagonal from bottom left to top right ( / ) */
      if((sRow1+1 === row && sCol1 === col) || (sRow2-1 === row && sCol2 === col)) {
        possibleSelection = true;
      }
    }

    return possibleSelection;
  }

  calculatePossibleMoves(row1: number, col1: number, row2: number, col2: number): {row: number, col: number}[] {
    const { figurePositionsBlue, figurePositionsRed } = this.state;
    const possibleMoves: {row: number, col: number}[] = [];

    const isFigureAndBlue = figurePositionsBlue.some(pos => pos.row === row1 && pos.col === col1);
    const isFigureAndRed = figurePositionsRed.some(pos => pos.row === row1 && pos.col === col1);

    for (let i = 1; i < boardRows.length+1; i++) {
      for (let j = 1; j < boardRows[i-1]+1; j++) {
        var adjustedJ = j;
        if(i > 5) {
          adjustedJ = j+(i-5);
        }
        //console.log(i + ", " + adjustedJ);
        //console.log(boardRows[i-1]);
        if (this.isAdjacent(row2, col2, i, adjustedJ) && !isFigureAndBlue && !isFigureAndRed) {
          possibleMoves.push({ row: i, col: adjustedJ });
        }
      }
    }

    return possibleMoves;
  }

  checkPossibleMoves(row1: number, col1: number, row2: number, col2: number) {
    var possibleMoves: {row: number, col: number}[] = [];

    possibleMoves = this.calculatePossibleMoves(row1, col1, row2, col2);

    var checkMoves = false;

    for (let i = 0; i < possibleMoves.length; i++) {
      if(possibleMoves[i].row === row1 && possibleMoves[i].col === col1) {
        checkMoves = true;
      }
    }
    return checkMoves;
  }

  render() {
    const { figurePositionsBlue, figurePositionsRed, selectedFigurePosition, selectedFigurePosition2, selectedFigurePosition3 } = this.state;
    return (
      <div className="hexboard-container">
        <div className="hexboard">
          {boardRows.map((numHexagons, i) => {
            const hexagons = Array.from({ length: numHexagons }, (_, j) => {

              let adjustedI = i+1;
              let adjustedJ = j+1;
              if(adjustedI > 5) {
                adjustedJ = adjustedJ+(i-4);
              }

              /*  */
              const isFigureAndBlue = figurePositionsBlue.some(pos => pos.row === adjustedI && pos.col === adjustedJ);
              const isFigureAndRed = figurePositionsRed.some(pos => pos.row === adjustedI && pos.col === adjustedJ);
              const isFigureAndSelected = selectedFigurePosition?.row === adjustedI && selectedFigurePosition?.col === adjustedJ;
              const isFigureAndSelected2 = selectedFigurePosition2?.row === adjustedI && selectedFigurePosition2?.col === adjustedJ;
              const isFigureAndSelected3 = selectedFigurePosition3?.row === adjustedI && selectedFigurePosition3?.col === adjustedJ;

              /* Shows the user, which moves he can do after having clicked on a Figure */
              var possibleMoves: {row: number, col: number}[] = [];

              /*if(selectedFigurePosition) {
                for (let i = 0; i < boardRows.length; i++) {
                  for (let j = 0; j < boardRows[i]; j++) {
                    if(this.isAdjacent(selectedFigurePosition?.row, selectedFigurePosition?.col, i, j) && !isFigureAndBlue && !isFigureAndRed)
                      possibleMoves.push({row: i, col: j});
                  }
                }
              }*/
              if(selectedFigurePosition) {
                possibleMoves = this.calculatePossibleMoves(adjustedI, adjustedJ, selectedFigurePosition.row, selectedFigurePosition.col);
              }

              //console.log(adjustedI + ", " + adjustedJ);

              /*console.log(selectedFigurePosition?.row + ", " + selectedFigurePosition?.col);
              console.log(selectedFigurePosition2?.row + ", " + selectedFigurePosition2?.col);
              console.log(selectedFigurePosition3?.row + ", " + selectedFigurePosition3?.col);*/

              const isPossibleMoves = possibleMoves.some(pos => pos.row === adjustedI && pos.col === adjustedJ);
              const isSelected = this.state.selectedFigurePosition && this.state.selectedFigurePosition.row === adjustedI && this.state.selectedFigurePosition.col === adjustedJ;
              return (
                <div
                  key={`${adjustedI}-${adjustedJ}`}
                  className={`hexagon-wrapper${isSelected ? ' selected' : ''}`}//className="hexagon-wrapper"
                  /*onClick={() => this.handleHexClick(i, j)}*/
                  onClick={() => this.handleHexClick(adjustedI, adjustedJ)}
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
                    <div className="circle" style={{ backgroundColor: "green" }} />
                  )}
                  {isFigureAndSelected3 && (
                    <div className="circle" style={{ backgroundColor: "green" }} />
                  )}
                  {isPossibleMoves && (
                    <div className="circle" style={{ backgroundColor: "gray" }} />
                  )}
                </div>
              );//<HexagonIcon className="hexagon" style={{ color: hexagonColor }} />
            });//const element = document.getElementById('figure-1-2');
            return <div className="row" key={i+1}>{hexagons}</div>;//const hexagon = document.getElementById("hex-1-2");
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