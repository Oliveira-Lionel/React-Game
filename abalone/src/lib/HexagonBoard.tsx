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

/* The actually HexagonBoard of the possible Fields */
const boardRows: number[] = [5, 6, 7, 8, 9, 8, 7, 6, 5];

var turnBlue = true;

class HexBoard extends React.Component<HexBoardProps, HexBoardState> {
  /* Constructor, which places the initial Figures in their correct Position */
  constructor(props: HexBoardProps) {
    super(props);

    const figurePositionsBlue: {row: number, col: number}[] = [];
    const figurePositionsRed: {row: number, col: number}[] = [];

    var col = 1;
    var max_col = 6;

    /* Indicate the correct Positions for the Figures */
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

    /* Insert Figures to the correct Positions */
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
    const { figurePositionsBlue, figurePositionsRed } = this.state;

    /* Verifies which Player is doing a Click Event */
    if(turnBlue) {
      this.clickEventsBothPlayers(row, col, figurePositionsBlue);
    } else {
      this.clickEventsBothPlayers(row, col, figurePositionsRed);
    }
  };

  /* All the Click Events depending on the situation (For TurnBlue and TurnRed) */
  clickEventsBothPlayers(row: number, col: number, figurePositions: Array<{ row: number, col: number }>) {
    const { selectedFigurePosition, selectedFigurePosition2, selectedFigurePosition3 } = this.state;

    /* Checks if the clicked Hexagon Field is the same has one of the already selected Figures */
    const selectionMatchesClicked = (selectedFigurePosition: { row: number; col: number } | null) => {
      return selectedFigurePosition && selectedFigurePosition.row === row && selectedFigurePosition.col === col;
    };

    // If a Digure is already selected
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
    } else
    /* Checks if the move with 3 Figures can be made, and fulfills it in case it works */
    if(selectedFigurePosition && selectedFigurePosition2 && selectedFigurePosition3 && this.checkPossibleMovesThreeFigures(row, col, selectedFigurePosition.row, selectedFigurePosition.col, selectedFigurePosition2.row, selectedFigurePosition2.col, selectedFigurePosition3.row, selectedFigurePosition3.col)) {
      
    /* Checks if the move with 2 Figure can be made, and fulfills it in case it works */
    } else if(selectedFigurePosition && selectedFigurePosition2 && this.checkPossibleMovesTwoFigures(row, col, selectedFigurePosition.row, selectedFigurePosition.col, selectedFigurePosition2.row, selectedFigurePosition2.col)) {
      /* New list of Blue and Red Figures' Positions */
      let newFigurePositions = figurePositions;

      /* Remove all Figures, which matches with the selected ones */
      newFigurePositions = newFigurePositions.filter(pos => !(pos.row === selectedFigurePosition.row && pos.col === selectedFigurePosition.col));
      newFigurePositions = newFigurePositions.filter(pos => !(pos.row === selectedFigurePosition2.row && pos.col === selectedFigurePosition2.col));

      if(selectedFigurePosition.row === selectedFigurePosition2.row && selectedFigurePosition.col-1 === selectedFigurePosition2.col) {
        if((selectedFigurePosition.row === row && selectedFigurePosition.col+1 === col) || (selectedFigurePosition.row-1 === row && selectedFigurePosition.col === col) || (selectedFigurePosition.row+1 === row && selectedFigurePosition.col+1 === col)) {
          /* Add the Figure to the clicked Position */
          newFigurePositions.push({ row: row, col: col });
          newFigurePositions.push({ row: row, col: col-1 });
        } else {
          /* Add the Figure to the clicked Position */
          newFigurePositions.push({ row: row, col: col });
          newFigurePositions.push({ row: row, col: col+1 });
        }
      } else if(selectedFigurePosition.col-1 === selectedFigurePosition2.col && selectedFigurePosition.row-1 === selectedFigurePosition2.row) {
        if((selectedFigurePosition.row+1 === row && selectedFigurePosition.col+1 === col) || (selectedFigurePosition.row === row && selectedFigurePosition.col+1 === col) || (selectedFigurePosition.row+1 === row && selectedFigurePosition.col === col)) {
          /* Add the Figure to the clicked Position */
          newFigurePositions.push({ row: row, col: col });
          newFigurePositions.push({ row: row-1, col: col-1 });
        } else {
          /* Add the Figure to the clicked Position */
          newFigurePositions.push({ row: row, col: col });
          newFigurePositions.push({ row: row+1, col: col+1 });
        }
      } else if(selectedFigurePosition.col === selectedFigurePosition2.col && selectedFigurePosition.row-1 === selectedFigurePosition2.row) {
        if((selectedFigurePosition.row+1 === row && selectedFigurePosition.col === col) || (selectedFigurePosition.row+1 === row && selectedFigurePosition.col+1 === col) || (selectedFigurePosition.row === row && selectedFigurePosition.col-1 === col)) {
          /* Add the Figure to the clicked Position */
          newFigurePositions.push({ row: row, col: col });
          newFigurePositions.push({ row: row-1, col: col });
        } else {
          /* Add the Figure to the clicked Position */
          newFigurePositions.push({ row: row, col: col });
          newFigurePositions.push({ row: row+1, col: col });
        }
      }
      
      if(turnBlue) {
        /* Next Turn: Red */
        turnBlue = false;
          
        /* Updates the state */
        this.setState({
          figurePositionsBlue: newFigurePositions,
          selectedFigurePosition: null,
          selectedFigurePosition2: null,
          selectedFigurePosition3: null,
        });
      } else {
        /* Next Turn: Blue */
        turnBlue = true;
      
        /* Updates the state */
        this.setState({
          figurePositionsRed: newFigurePositions,
          selectedFigurePosition: null,
          selectedFigurePosition2: null,
          selectedFigurePosition3: null,
        });
      }
    /* Checks if the move with 1 Figure can be made, and fulfills it in case it works */
    } else if(selectedFigurePosition && this.checkPossibleMoves(row, col, selectedFigurePosition.row, selectedFigurePosition.col)) {
      /* New list of Blue and Red Figures' Positions */
      let newFigurePositions = figurePositions;

      /* Remove all Figures, which matches with the selected ones */
      newFigurePositions = newFigurePositions.filter(pos => !(pos.row === selectedFigurePosition.row && pos.col === selectedFigurePosition.col));

      /* Add the Figure to the clicked Position */
      newFigurePositions.push({ row: row, col: col });

      if(turnBlue) {
        /* Next Turn: Red */
        turnBlue = false;
          
        /* Updates the state */
        this.setState({
          figurePositionsBlue: newFigurePositions,
          selectedFigurePosition: null,
          selectedFigurePosition2: null,
          selectedFigurePosition3: null,
        });
      } else {
        /* Next Turn: Blue */
        turnBlue = true;
      
        /* Updates the state */
        this.setState({
          figurePositionsRed: newFigurePositions,
          selectedFigurePosition: null,
          selectedFigurePosition2: null,
          selectedFigurePosition3: null,
        });
      }
    } else {
      /* Select a Figure that should be moved (selectedFigurePosition) */
      /* Optimize it */
      const clickedPosition = figurePositions.find(pos => pos.row === row && pos.col === col);

      if(clickedPosition) {
        if(selectedFigurePosition && selectedFigurePosition2 && selectedFigurePosition3 && this.isThirdSelection(row, col, selectedFigurePosition2.row, selectedFigurePosition2.col, selectedFigurePosition3.row, selectedFigurePosition3.col)) {
          this.setState({ 
            selectedFigurePosition: selectedFigurePosition2,
            selectedFigurePosition2: selectedFigurePosition3,
            selectedFigurePosition3: clickedPosition,
          });
        } else if(selectedFigurePosition && selectedFigurePosition2 && this.isThirdSelection(row, col, selectedFigurePosition.row, selectedFigurePosition.col, selectedFigurePosition2.row, selectedFigurePosition2.col)) {
          if(row > selectedFigurePosition.row) {
            this.setState({ 
              selectedFigurePosition3: selectedFigurePosition2,
              selectedFigurePosition2: selectedFigurePosition,
              selectedFigurePosition: clickedPosition,
            });
          } else if(col > selectedFigurePosition.col && row === selectedFigurePosition.row) {
            this.setState({ 
              selectedFigurePosition3: selectedFigurePosition2,
              selectedFigurePosition2: selectedFigurePosition,
              selectedFigurePosition: clickedPosition,
            });
          } else if(row > selectedFigurePosition2.row) {
            this.setState({ 
              selectedFigurePosition3: selectedFigurePosition2,
              selectedFigurePosition2: clickedPosition,
            });
          } else if(col > selectedFigurePosition2.col && row === selectedFigurePosition2.row) {
            this.setState({ 
              selectedFigurePosition3: selectedFigurePosition2,
              selectedFigurePosition2: clickedPosition,
            });
          } else {
            this.setState({ 
              selectedFigurePosition3: clickedPosition,
            });
          }
        } else if(selectedFigurePosition && this.isAdjacent(row, col, selectedFigurePosition.row, selectedFigurePosition.col)) {
          if(row > selectedFigurePosition.row) {
            this.setState({ 
              selectedFigurePosition2: selectedFigurePosition,
              selectedFigurePosition: clickedPosition,
              selectedFigurePosition3: null,
            });
          } else if(col > selectedFigurePosition.col) {
            this.setState({ 
              selectedFigurePosition2: selectedFigurePosition,
              selectedFigurePosition: clickedPosition,
              selectedFigurePosition3: null,
            });
          } else {
            this.setState({ 
              selectedFigurePosition2: clickedPosition,
              selectedFigurePosition3: null,
            });
          }
        } else {
          this.setState({ 
            selectedFigurePosition: clickedPosition,
            selectedFigurePosition2: null,
            selectedFigurePosition3: null,
          });
        }
      }
    }
  }

  /* Checks if the new Position (row1 & col1) is adjacent with the previous selected Figure's Position (row2 & col2) */
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
      /* Selection of a third Figure, which is horizontal ( - ) */
      if((sRow === row && sCol+1 === col) || (sRow2 === row && sCol2-1 === col)) {
        possibleSelection = true;
      }
    } else if(sRow-1 === sRow2 && sCol-1 === sCol2) {
      /* Selection of a third Figure, which is diagonal from bottom right to top left ( \ ) */
      if((sRow+1 === row && sCol+1 === col) || (sRow2-1 === row && sCol2-1 === col)) {
        possibleSelection = true;
      }
    } else if(sRow-1 === sRow2 && sCol === sCol2) {
      /* Selection of a third Figure, which is diagonal from bottom left to top right ( / ) */
      if((sRow+1 === row && sCol === col) || (sRow2-1 === row && sCol2 === col)) {
        possibleSelection = true;
      }
    }

    return possibleSelection;
  }

  /* Returns a list of all the possible moves that a single Figure can do */
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


    function isFigure(row: number, col: number): boolean {
      const isFigureAndBlue = figurePositionsBlue.some(pos => pos.row === row && pos.col === col);
      const isFigureAndRed = figurePositionsRed.some(pos => pos.row === row && pos.col === col);
      
      return isFigureAndBlue || isFigureAndRed;
    }

    const isFigureAndBlue = figurePositionsBlue.some(pos => pos.row === row && pos.col === col);
    const isFigureAndRed = figurePositionsRed.some(pos => pos.row === row && pos.col === col);

    if(sRow === sRow2 && sCol-1 === sCol2) {
      if(sRow && sCol+1 && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow, col: sCol+1 });
      }
      if(sRow2 && sCol2-1 && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow2, col: sCol2-1 });
      }
      if(sRow-1 && sCol && sRow-1 && sCol-1 && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow-1, col: sCol });
      }
      if(sRow+1 && sCol+1 && sRow+1 && sCol && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow+1, col: sCol+1 });
      }
      if(sRow2-1 && sCol2-1 && sRow2-1 && sCol2 && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow2-1, col: sCol2-1 });
      }
      if(sRow2+1 && sCol2 && sRow2+1 && sCol2+1 && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow2+1, col: sCol2 });
      }
    } else if(sCol-1 === sCol2 && sRow-1 === sRow2) {
      if(sRow+1 && sCol+1 && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow+1, col: sCol+1 });
      }
      if(sRow2-1 && sCol2-1 && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow2-1, col: sCol2-1 });
      }
      if(sRow && sCol+1 && sRow-1 && sCol && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow, col: sCol+1 });
      }
      if(sRow+1 && sCol && sRow && sCol-1 && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow+1, col: sCol });
      }
      if(sRow2-1 && sCol2 && sRow2 && sCol2+1 && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow2-1, col: sCol2 });
      }
      if(sRow2 && sCol2-1 && sRow2+1 && sCol2 && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow2, col: sCol2-1 });
      }
    } else if(sCol === sCol2 && sRow-1 === sRow2) {
      if(sRow+1 && sCol && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow+1, col: sCol });
      }
      if(sRow2-1 && sCol2 && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow2-1, col: sCol2 });
      }
      if(sRow+1 && sCol+1 && sRow && sCol+1 && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow+1, col: sCol+1 });
      }
      if(sRow && sCol-1 && sRow-1 && sCol-1 && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow, col: sCol-1 });
      }
      if(sRow2 && sCol2+1 && sRow2+1 && sCol2+1 && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow2, col: sCol2+1 });
      }
      if(sRow2-1 && sCol2-1 && sRow2 && sCol2-1 && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow2-1, col: sCol2-1 });
      }
    }

    return possibleMoves;
  }

  calculatePossibleMovesThreeFigures(row: number, col: number, sRow: number, sCol: number, sRow2: number, sCol2: number, sRow3: number, sCol3: number): {row: number, col: number}[] {
    const { figurePositionsBlue, figurePositionsRed } = this.state;
    const possibleMoves: {row: number, col: number}[] = [];

    const isFigureAndBlue = figurePositionsBlue.some(pos => pos.row === row && pos.col === col);
    const isFigureAndRed = figurePositionsRed.some(pos => pos.row === row && pos.col === col);


    if(sRow === sRow2 && sCol-1 === sCol2) {
      if(sRow && sCol+1 && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow, col: sCol+1 });
      }
      if(sRow3 && sCol3-1 && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow3, col: sCol3-1 });
      }
      if(sRow-1 && sCol && sRow-1 && sCol-1 && !isFigureAndBlue && !isFigureAndRed && sRow-1 && sCol-2) {
        possibleMoves.push({ row: sRow-1, col: sCol });
      }
      if(sRow+1 && sCol+1 && sRow+1 && sCol && !isFigureAndBlue && !isFigureAndRed && sRow+1 && sCol-1) {
        possibleMoves.push({ row: sRow+1, col: sCol+1 });
      }
      if(sRow3-1 && sCol3-1 && sRow3-1 && sCol3 && !isFigureAndBlue && !isFigureAndRed && sRow3-1 && sRow3+1) {
        possibleMoves.push({ row: sRow3-1, col: sCol3-1 });
      }
      if(sRow3+1 && sCol3 && sRow3+1 && sCol3+1 && !isFigureAndBlue && !isFigureAndRed && sRow3+1 && sCol3+2) {
        possibleMoves.push({ row: sRow3+1, col: sCol3 });
      }
    } else if(sCol-1 === sCol2 && sRow-1 === sRow2) {
      if(sRow+1 && sCol+1 && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow+1, col: sCol+1 });
      }
      if(sRow3-1 && sCol3-1 && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow3-1, col: sCol3-1 });
      }
      if(sRow && sCol+1 && sRow-1 && sCol && !isFigureAndBlue && !isFigureAndRed && sRow-2 && sCol-1) {
        possibleMoves.push({ row: sRow, col: sCol+1 });
      }
      if(sRow+1 && sCol && sRow && sCol-1 && !isFigureAndBlue && !isFigureAndRed && sRow-1 && sCol-2 ) {
        possibleMoves.push({ row: sRow+1, col: sCol });
      }
      if(sRow3-1 && sCol3 && sRow3 && sCol3+1 && !isFigureAndBlue && !isFigureAndRed && sRow3+1 && sCol3+2) {
        possibleMoves.push({ row: sRow3-1, col: sCol3 });
      }
      if(sRow3 && sCol3-1 && sRow3+1 && sCol3 && !isFigureAndBlue && !isFigureAndRed && sRow3+2 && sCol3+1) {
        possibleMoves.push({ row: sRow3, col: sCol3-1 });
      }
    } else if(sCol === sCol2 && sRow-1 === sRow2) {
      if(sRow+1 && sCol && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow+1, col: sCol });
      }
      if(sRow3-1 && sCol3 && !isFigureAndBlue && !isFigureAndRed) {
        possibleMoves.push({ row: sRow3-1, col: sCol3 });
      }
      if(sRow+1 && sCol+1 && sRow && sCol+1 && !isFigureAndBlue && !isFigureAndRed && sRow-1 && sCol+1) {
        possibleMoves.push({ row: sRow+1, col: sCol+1 });
      }
      if(sRow && sCol-1 && sRow-1 && sCol-1 && !isFigureAndBlue && !isFigureAndRed && sRow-2 && sCol-1) {
        possibleMoves.push({ row: sRow, col: sCol-1 });
      }
      if(sRow3 && sCol3+1 && sRow3+1 && sCol3+1 && !isFigureAndBlue && !isFigureAndRed && sRow3+2 && sCol3+1) {
        possibleMoves.push({ row: sRow3, col: sCol3+1 });
      }
      if(sRow3-1 && sCol3-1 && sRow3 && sCol3-1 && !isFigureAndBlue && !isFigureAndRed && sRow3+1 && sCol3-1) {
        possibleMoves.push({ row: sRow3-1, col: sCol3-1 });
      }
    }

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

    for (let i = 0; i < possibleMoves.length; i++) {
      if(possibleMoves[i].row === row && possibleMoves[i].col === col) {
        checkMoves = true;
      }
    }

    return checkMoves;
  }

  checkPossibleMovesThreeFigures(row: number, col: number, sRow: number, sCol: number, sRow2: number, sCol2: number, sRow3: number, sCol3: number) {
    var possibleMoves: {row: number, col: number}[] = [];
    var checkMoves = false;

    possibleMoves = this.calculatePossibleMovesThreeFigures(row, col, sRow, sCol, sRow2, sCol2, sRow3, sCol3);

    for (let i = 0; i < possibleMoves.length; i++) {
      if(possibleMoves[i].row === row && possibleMoves[i].col === col) {
        checkMoves = true;
      }
    }

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

              /* Guarantees that the Positions of each Hexagon Field is convenient to work with it */
              let adjustedI = i+1;
              let adjustedJ = j+1;

              if(adjustedI > 5) {
                adjustedJ = adjustedJ+(i-4);
              }

              var possibleMoves: {row: number, col: number}[] = [];

              if(selectedFigurePosition && selectedFigurePosition2 && selectedFigurePosition3) {
                possibleMoves = this.calculatePossibleMovesThreeFigures(adjustedI, adjustedJ, selectedFigurePosition.row, selectedFigurePosition.col, selectedFigurePosition2.row, selectedFigurePosition2.col, selectedFigurePosition3.row, selectedFigurePosition3.col);
              } else if(selectedFigurePosition && selectedFigurePosition2) {
                possibleMoves = this.calculatePossibleMovesTwoFigures(adjustedI, adjustedJ, selectedFigurePosition.row, selectedFigurePosition.col, selectedFigurePosition2.row, selectedFigurePosition2.col);
              } else if(selectedFigurePosition) {
                possibleMoves = this.calculatePossibleMoves(adjustedI, adjustedJ, selectedFigurePosition.row, selectedFigurePosition.col);
              }

              /* Checks the Position of each element */
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
                  <HexagonIcon className="hexagon" style={{ fontSize: "120px", color: "#F58900" }} />
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