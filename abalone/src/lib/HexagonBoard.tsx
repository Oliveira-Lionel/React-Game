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

    const figurePositionsBlue: {row: number, col: number}[] = [];
    const figurePositionsRed: {row: number, col: number}[] = [];

    var col = 1;
    var max_col = 6;

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

    /* Change Turn of Players */
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
      /* Optimize it */
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
      /* Checks if the move with 3 figures can be made, and fulfills it in case it works */
      else if(selectedFigurePosition && selectedFigurePosition2 && selectedFigurePosition3 && this.checkPossibleMovesThreeFigures(row, col, selectedFigurePosition.row, selectedFigurePosition.col, selectedFigurePosition2.row, selectedFigurePosition2.col, selectedFigurePosition3.row, selectedFigurePosition3.col)) {

      /* Checks if the move with 2 figure can be made, and fulfills it in case it works */
      } else if(selectedFigurePosition && selectedFigurePosition2 && this.checkPossibleMovesTwoFigures(row, col, selectedFigurePosition.row, selectedFigurePosition.col, selectedFigurePosition2.row, selectedFigurePosition2.col)) {

      /* Checks if the move with 1 figure can be made, and fulfills it in case it works */
      } else if(selectedFigurePosition && this.checkPossibleMoves(row, col, selectedFigurePosition.row, selectedFigurePosition.col)) {
        /* New List of Blue and Red Figures' Positions */
        let newFigurePositionsBlue = figurePositionsBlue;
        let newFigurePositionsRed = figurePositionsRed;

        if(turnBlue) {
          /* Remove all Figures, which matches with the selected ones */
          newFigurePositionsBlue = newFigurePositionsBlue.filter(pos => !(pos.row === selectedFigurePosition.row && pos.col === selectedFigurePosition.col));
          
          /* Add the figure to the clicked position */
          newFigurePositionsBlue.push({ row: row, col: col });

          /* Next turn: Red */
          turnBlue = false;
        } else {
          /* Remove all Figures, which doesn't match with the selected ones */
          newFigurePositionsRed = newFigurePositionsRed.filter(pos => !(pos.row === selectedFigurePosition.row && pos.col === selectedFigurePosition.col));

          /* Add the figure to the clicked position */
          newFigurePositionsRed.push({ row: row, col: col });

          /* Next turn: Blue */
          turnBlue = true;
        }
        // Update the state
        this.setState({
          figurePositionsBlue: newFigurePositionsBlue,
          figurePositionsRed: newFigurePositionsRed,
          selectedFigurePosition: null,
          selectedFigurePosition2: null,
          selectedFigurePosition3: null,
        });
      } else {
        /* Select a Figure that should be moved (selectedFigurePosition) */
        /* Optimize it */
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

  /* All the click events depending on the situation (For TurnBlue and TurnRed) */
  clickEventsBothPlayers(row: number, col: number, figurePositions: Array<{ row: number, col: number }>) {
    
  }






  /* Checks if the new position (row1 & col1) is adjacent with the previous selected figure's position (row2 & col2) */
  isAdjacent = (row: number, col: number, sRow: number, sCol: number) => {
    var adjacent = false;

    if((Math.abs(sRow - row) <= 1 && Math.abs(sCol - col) <= 1) && !((Math.abs(sRow - row) === 1 && Math.abs(sCol - col) === 1) && (sRow - row !== sCol - col))) {
      adjacent = true;
    }

    return (
      adjacent
    );
  };

  /* Checks if the clicked Position should be the third selectedFigurePosition */
  isThirdSelection(row: number, col: number, sRow: number, sCol: number, sRow2: number, sCol2: number) {
    var possibleSelection = false;

    if(sRow === sRow2 && sCol-1 === sCol2) {
      /* Selection of a third figure, which is horizontal ( - ) */
      if((sRow === row && sCol+1 === col) || (sRow2 === row && sCol2-1 === col)) {
        possibleSelection = true;
      }
    } else if(sRow-1 === sRow2 && sCol-1 === sCol2) {
      /* Selection of a third figure, which is diagonal from bottom right to top left ( \ ) */
      if((sRow+1 === row && sCol+1 === col) || (sRow2-1 === row && sCol2-1 === col)) {
        possibleSelection = true;
      }
    } else if(sRow-1 === sRow2 && sCol === sCol2) {
      /* Selection of a third figure, which is diagonal from bottom left to top right ( / ) */
      if((sRow+1 === row && sCol === col) || (sRow2-1 === row && sCol2 === col)) {
        possibleSelection = true;
      }
    }

    return possibleSelection;
  }

  /* Returns a list of all the possible moves that a single figure can do */
  calculatePossibleMoves(row: number, col: number, sRow: number, sCol: number): {row: number, col: number}[] {
    const { figurePositionsBlue, figurePositionsRed } = this.state;
    const possibleMoves: {row: number, col: number}[] = [];

    const isFigureAndBlue = figurePositionsBlue.some(pos => pos.row === row && pos.col === col);
    const isFigureAndRed = figurePositionsRed.some(pos => pos.row === row && pos.col === col);

    for (let i = 1; i < boardRows.length+1; i++) {
      for (let j = 1; j < boardRows[i-1]+1; j++) {
        var adjustedJ = j;

        if(i > 5) {
          adjustedJ = j+(i-5);
        }
        if (this.isAdjacent(sRow, sCol, i, adjustedJ) && !isFigureAndBlue && !isFigureAndRed) {
          possibleMoves.push({ row: i, col: adjustedJ });
        }
      }
    }

    return possibleMoves;
  }

  calculatePossibleMovesTwoFigures(row: number, col: number, sRow: number, sCol: number, sRow2: number, sCol2: number): {row: number, col: number}[] {
    const { figurePositionsBlue, figurePositionsRed } = this.state;
    const possibleMoves: {row: number, col: number}[] = [];

    const isFigureAndBlue = figurePositionsBlue.some(pos => pos.row === row && pos.col === col);
    const isFigureAndRed = figurePositionsRed.some(pos => pos.row === row && pos.col === col);

    /*for (let i = 1; i < boardRows.length+1; i++) {
      for (let j = 1; j < boardRows[i-1]+1; j++) {
        var adjustedJ = j;

        if(i > 5) {
          adjustedJ = j+(i-5);
        }
        if (this.isAdjacent(row2, col2, i, adjustedJ) && !isFigureAndBlue && !isFigureAndRed) {
          possibleMoves.push({ row: i, col: adjustedJ });
        }
      }
    }*/

    return possibleMoves;
  }

  calculatePossibleMovesThreeFigures(row: number, col: number, sRow: number, sCol: number, sRow2: number, sCol2: number, sRow3: number, sCol3: number): {row: number, col: number}[] {
    const { figurePositionsBlue, figurePositionsRed } = this.state;
    const possibleMoves: {row: number, col: number}[] = [];

    const isFigureAndBlue = figurePositionsBlue.some(pos => pos.row === row && pos.col === col);
    const isFigureAndRed = figurePositionsRed.some(pos => pos.row === row && pos.col === col);

    /*for (let i = 1; i < boardRows.length+1; i++) {
      for (let j = 1; j < boardRows[i-1]+1; j++) {
        var adjustedJ = j;

        if(i > 5) {
          adjustedJ = j+(i-5);
        }
        if (this.isAdjacent(row2, col2, i, adjustedJ) && !isFigureAndBlue && !isFigureAndRed) {
          possibleMoves.push({ row: i, col: adjustedJ });
        }
      }
    }*/

    return possibleMoves;
  }

  /* Returns a true false if possible moves are available for a specific case */
  checkPossibleMoves(row: number, col: number, sRow: number, sCol: number) {
    var possibleMoves: {row: number, col: number}[] = [];
    var checkMoves = false;

    possibleMoves = this.calculatePossibleMoves(row, col, sRow, sCol);

    for (let i = 0; i < possibleMoves.length; i++) {
      if(possibleMoves[i].row === row && possibleMoves[i].col === col) {
        checkMoves = true;
      }
    }

    return checkMoves;
  }

  checkPossibleMovesTwoFigures(row: number, col: number, sRow: number, sCol: number, sRow2: number, sCol2: number) {
    var possibleMoves: {row: number, col: number}[] = [];
    var checkMoves = false;

    possibleMoves = this.calculatePossibleMovesTwoFigures(row, col, sRow, sCol, sRow2, sCol2);

    /*for (let i = 0; i < possibleMoves.length; i++) {
      if(possibleMoves[i].row === row1 && possibleMoves[i].col === col1) {
        checkMoves = true;
      }
    }*/

    return checkMoves;
  }

  checkPossibleMovesThreeFigures(row: number, col: number, sRow: number, sCol: number, sRow2: number, sCol2: number, sRow3: number, sCol3: number) {
    var possibleMoves: {row: number, col: number}[] = [];
    var checkMoves = false;

    possibleMoves = this.calculatePossibleMovesThreeFigures(row, col, sRow, sCol, sRow2, sCol2, sRow3, sCol3);

    /*for (let i = 0; i < possibleMoves.length; i++) {
      if(possibleMoves[i].row === row1 && possibleMoves[i].col === col1) {
        checkMoves = true;
      }
    }*/

    return checkMoves;
  }

  /* Updates the visualization of the current state of the webpage */
  render() {
    const { figurePositionsBlue, figurePositionsRed, selectedFigurePosition, selectedFigurePosition2, selectedFigurePosition3 } = this.state;
    return (
      <div className="hexboard-container">
        <div className="hexboard">
          {boardRows.map((numHexagons, i) => {
            const hexagons = Array.from({ length: numHexagons }, (_, j) => {

              /* Guarantee that the positions of each Hexagon Field is convenient to work with it */
              let adjustedI = i+1;
              let adjustedJ = j+1;

              if(adjustedI > 5) {
                adjustedJ = adjustedJ+(i-4);
              }

              var possibleMoves: {row: number, col: number}[] = [];

              if(selectedFigurePosition) {
                possibleMoves = this.calculatePossibleMoves(adjustedI, adjustedJ, selectedFigurePosition.row, selectedFigurePosition.col);
              }

              /* Checks the position of each element */
              const isFigureAndBlue = figurePositionsBlue.some(pos => pos.row === adjustedI && pos.col === adjustedJ);
              const isFigureAndRed = figurePositionsRed.some(pos => pos.row === adjustedI && pos.col === adjustedJ);
              const isFigureAndSelected = selectedFigurePosition?.row === adjustedI && selectedFigurePosition?.col === adjustedJ;
              const isFigureAndSelected2 = selectedFigurePosition2?.row === adjustedI && selectedFigurePosition2?.col === adjustedJ;
              const isFigureAndSelected3 = selectedFigurePosition3?.row === adjustedI && selectedFigurePosition3?.col === adjustedJ;
              const isPossibleMoves = possibleMoves.some(pos => pos.row === adjustedI && pos.col === adjustedJ);

              /* Visualization */
              return (
                <div
                  key={`${adjustedI}-${adjustedJ}`}
                  className="hexagon-wrapper"
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
              );
            });
            return <div className="row" key={i+1}>{hexagons}</div>;
          })}
        </div>
      </div>
    );
  }
}
    
export default HexBoard;