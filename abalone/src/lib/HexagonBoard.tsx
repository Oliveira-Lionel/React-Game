import HexagonIcon from '@mui/icons-material/Hexagon';
import React from 'react';
import "../App.css";

interface HexBoardProps {}

interface HexBoardState {
  /* All First Player's Figures on the Board */
  figurePositions1P: Array<{ row: number, col: number }>;
  /* All Second Player's Figures on the Board */
  figurePositions2P: Array<{ row: number, col: number }>;
  /* Up to three Selections of Figures a Player can make on the Board */
  selectedFigure: { row: number; col: number } | null;
  selectedFigure2: { row: number; col: number } | null;
  selectedFigure3: { row: number; col: number } | null;
  /* Hovering with the mouse */
  isHovered: boolean;
}

/* The actually Hexagon Board of the possible Hexagon Fields */
const boardRows: number[] = [5, 6, 7, 8, 9, 8, 7, 6, 5];

var turn1P = true;

var collision = false;

class HexBoard extends React.Component<HexBoardProps, HexBoardState> {
  /* Constructor, which places the initial Figures in their correct Position */
  constructor(props: HexBoardProps) {
    super(props);

    const figurePositions1P: {row: number, col: number}[] = [];
    const figurePositions2P: {row: number, col: number}[] = [];

    var col = 1;
    var max_col = 6;

    /* Indicate the correct Positions for the Figures */
    for (let row = 1; row < 10; row++) {
      while(col < max_col) {
        if((row === 8 && (4 <= col && col <= 9)) || (row === 9 && (5 <= col && col <= 9)) || (row === 7 && (5 <= col && col <= 7))) {
          figurePositions1P.push({row: row, col: col});
        }
        if((row === 1 && (1 <= col && col <= 5)) || (row === 2 && (1 <= col && col <= 6)) || (row === 3 && (3 <= col && col <= 5))) {
          figurePositions2P.push({row: row, col: col});
        }

        col++;
      }

      max_col++
      col = 0;
    }

    /* Insert Figures to the correct Positions */
    this.state = {
      figurePositions1P: figurePositions1P,
      figurePositions2P: figurePositions2P,
      selectedFigure: null,
      selectedFigure2: null,
      selectedFigure3: null,
      isHovered: false,
    };
  }

  /* Click Events */
  handleHexClick = (row: number, col: number) => {
    const { figurePositions1P, figurePositions2P } = this.state;

    /* Verifies which Player is doing a Click Event */
    if(turn1P) {
      this.clickEventsBothPlayers(row, col, figurePositions1P, figurePositions2P);
      console.log(figurePositions1P.length);
      console.log(figurePositions2P.length);
    } else {
      this.clickEventsBothPlayers(row, col, figurePositions2P, figurePositions1P);
      console.log(figurePositions1P.length);
      console.log(figurePositions2P.length);
    }
  };

  /* Hover Event */
  handleHexHover = (hovered: boolean) => {
    this.setState({ isHovered: hovered });
  };

  /* All the Click Events depending on the situation (For Turn1P and Turn2P) */
  clickEventsBothPlayers(row: number, col: number, figurePositions: Array<{ row: number, col: number }>, figurePositions2: Array<{ row: number, col: number }>) {
    const { selectedFigure, selectedFigure2, selectedFigure3 } = this.state;

    /* Checks if the clicked Hexagon Field is the same has one of the already selected Figures */
    const selectionMatchesClicked = (selectedFigure: { row: number; col: number } | null) => {
      return selectedFigure && selectedFigure.row === row && selectedFigure.col === col;
    };

    /* If a Figure is already selected 
    /* Remove Clicked selectedFigure */
    if (selectionMatchesClicked(selectedFigure) || selectionMatchesClicked(selectedFigure2) || selectionMatchesClicked(selectedFigure3)) {
      /* selectedFigure3 is selected and therefore being removed */
      if(selectionMatchesClicked(selectedFigure3)) {
        this.setState({ 
          selectedFigure3: null,
        });
      /* selectedFigure2 is selected and therefore being removed, while selectedFigure3 is null */
      } else if(selectionMatchesClicked(selectedFigure2) && !selectedFigure3) {
        this.setState({ 
          selectedFigure2: null,
        });
        /* selectedFigure2 is selected and therefore being removed as well as selectedFigure3 */
      } else if(selectionMatchesClicked(selectedFigure2) && selectedFigure3) {
        this.setState({ 
          selectedFigure2: null,
          selectedFigure3: null,
        });
      /* selectedFigure is selected and therefore being removed */
      } else if(selectionMatchesClicked(selectedFigure) && !selectedFigure2 && !selectedFigure3) {
        this.setState({ 
          selectedFigure: null,
        });
      /* selectedFigure is selected, while selectedFigure2 isn't null, therefore receiving selectedFigure2's value and selectedFigure2 is removed */
      } else if(selectionMatchesClicked(selectedFigure) && selectedFigure2 && !selectedFigure3) {
        this.setState({ 
          selectedFigure: selectedFigure2,
          selectedFigure2: null,
        });
      /* selectedFigure is selected, while selectedFigure2 and selectedFigure3 isn't null, therefore changing values and selectedFigure3 is removed */
      } else if(selectionMatchesClicked(selectedFigure) && selectedFigure2 && selectedFigure3) {
        this.setState({ 
          selectedFigure: selectedFigure2,
          selectedFigure2: selectedFigure3,
          selectedFigure3: null,
        });
      }
    } else
    /* Checks if the move with 3 Figures can be made, and fulfills it in case it works */
    if(selectedFigure && selectedFigure2 && selectedFigure3) {
      if(this.checkPossibleMovesThreeFigures(row, col, selectedFigure.row, selectedFigure.col, selectedFigure2.row, selectedFigure2.col, selectedFigure3.row, selectedFigure3.col)) {
        /* New list of First Player and Second Player Figures' Positions */
        let newFigurePositions = figurePositions;
        let newFigurePositions2 = figurePositions2;

        /* Remove all Figures, which matches with the selected ones */
        newFigurePositions = newFigurePositions.filter(pos => !(pos.row === selectedFigure.row && pos.col === selectedFigure.col));
        newFigurePositions = newFigurePositions.filter(pos => !(pos.row === selectedFigure2.row && pos.col === selectedFigure2.col));
        newFigurePositions = newFigurePositions.filter(pos => !(pos.row === selectedFigure3.row && pos.col === selectedFigure3.col));

        /* Case, where the Selections are horizontal ( - ) */
        if(selectedFigure.row === selectedFigure2.row && selectedFigure.col-1 === selectedFigure2.col) {
          if((selectedFigure.row === row && selectedFigure.col+1 === col) || (selectedFigure.row-1 === row && selectedFigure.col === col) || (selectedFigure.row+1 === row && selectedFigure.col+1 === col)) {
            /* Add the Figures to the clicked and adjacent Positions */
            newFigurePositions.push({ row: row, col: col });
            newFigurePositions.push({ row: row, col: col-1 });
            newFigurePositions.push({ row: row, col: col-2 });

            if(collision) {
              /* Moving 2 Figures */
              if(this.isFigure(row, col+1)) {
                newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row && pos.col === col));
                //newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row && pos.col === col+1));

                //newFigurePositions2.push({ row: row, col: col+1 });
                if(this.isInBoardRows(row, col+2))
                  newFigurePositions2.push({ row: row, col: col+2 });

                collision = false;
              /* Moving 1 Figure */
              } else {
                newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row && pos.col === col));

                if(this.isInBoardRows(row, col+1))
                  newFigurePositions2.push({ row: row, col: col+1 });

                collision = false;
              }
            }
          } else {
            newFigurePositions.push({ row: row, col: col });
            newFigurePositions.push({ row: row, col: col+1 });
            newFigurePositions.push({ row: row, col: col+2 });

            if(collision) {
              if(this.isFigure(row, col-1)) {
                newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row && pos.col === col));
                //newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row && pos.col === col-1));

                //newFigurePositions2.push({ row: row, col: col-1 });
                if(this.isInBoardRows(row, col-2))
                  newFigurePositions2.push({ row: row, col: col-2 });

                collision = false;
              } else {
                newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row && pos.col === col));

                if(this.isInBoardRows(row, col-1))
                  newFigurePositions2.push({ row: row, col: col-1 });

                collision = false;
              }
            }
            
          }
        /* Case, where the Selections are diagonal from bottom right to top left ( \ ) */
        } else if(selectedFigure.col-1 === selectedFigure2.col && selectedFigure.row-1 === selectedFigure2.row) {
          if((selectedFigure.row+1 === row && selectedFigure.col+1 === col) || (selectedFigure.row === row && selectedFigure.col+1 === col) || (selectedFigure.row+1 === row && selectedFigure.col === col)) {
            /* Add the Figures to the clicked and adjacent Positions */
            newFigurePositions.push({ row: row, col: col });
            newFigurePositions.push({ row: row-1, col: col-1 });
            newFigurePositions.push({ row: row-2, col: col-2 });

            if(collision) {
              if(this.isFigure(row+1, col+1)) {
                newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row && pos.col === col));
                //newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row+1 && pos.col === col+1));

                //newFigurePositions2.push({ row: row+1, col: col+1 });
                if(this.isInBoardRows(row+2, col+2))
                  newFigurePositions2.push({ row: row+2, col: col+2 });

                collision = false;
              } else {
                newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row && pos.col === col));

                if(this.isInBoardRows(row+1, col+1))
                  newFigurePositions2.push({ row: row+1, col: col+1 });

                collision = false;
              }
            }
          } else {
            newFigurePositions.push({ row: row, col: col });
            newFigurePositions.push({ row: row+1, col: col+1 });
            newFigurePositions.push({ row: row+2, col: col+2 });

            if(collision) {
              if(this.isFigure(row-1, col-1)) {
                newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row && pos.col === col));
                //newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row-1 && pos.col === col-1));

                //newFigurePositions2.push({ row: row-1, col: col-1 });
                if(this.isInBoardRows(row-2, col-2))
                  newFigurePositions2.push({ row: row-2, col: col-2 });

                collision = false;
              } else {
                newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row && pos.col === col));

                if(this.isInBoardRows(row-1, col-1))
                  newFigurePositions2.push({ row: row-1, col: col-1 });

                collision = false;
              }
            }
          }
        /* Case, where the Selections are diagonal from bottom left to top right ( / ) */
        } else if(selectedFigure.col === selectedFigure2.col && selectedFigure.row-1 === selectedFigure2.row) {
          if((selectedFigure.row+1 === row && selectedFigure.col === col) || (selectedFigure.row+1 === row && selectedFigure.col+1 === col) || (selectedFigure.row === row && selectedFigure.col-1 === col)) {
            /* Add the Figures to the clicked and adjacent Positions */
            newFigurePositions.push({ row: row, col: col });
            newFigurePositions.push({ row: row-1, col: col });
            newFigurePositions.push({ row: row-2, col: col });

            if(collision) {
              if(this.isFigure(row+1, col)) {
                newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row && pos.col === col));
                //newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row+1 && pos.col === col));

                //newFigurePositions2.push({ row: row+1, col: col });
                if(this.isInBoardRows(row+2, col))
                  newFigurePositions2.push({ row: row+2, col: col });

                collision = false;
              } else {
                newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row && pos.col === col));

                if(this.isInBoardRows(row+1, col))
                  newFigurePositions2.push({ row: row+1, col: col });

                collision = false;
              }
            }
          } else {
            newFigurePositions.push({ row: row, col: col });
            newFigurePositions.push({ row: row+1, col: col });
            newFigurePositions.push({ row: row+2, col: col });

            if(collision) {
              if(this.isFigure(row-1, col)) {
                newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row && pos.col === col));
                //newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row-1 && pos.col === col));

                //newFigurePositions2.push({ row: row-1, col: col });
                if(this.isInBoardRows(row-2, col))
                  newFigurePositions2.push({ row: row-2, col: col });

                collision = false;
              } else {
                newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row && pos.col === col));

                if(this.isInBoardRows(row-1, col))
                  newFigurePositions2.push({ row: row-1, col: col });

                collision = false;
              }
            }
          }
        }
        
        if(turn1P) {
          /* Next Turn: Second Player */
          turn1P = false;
            
          /* Updates the state */
          this.setState({
            figurePositions1P: newFigurePositions,
            figurePositions2P: newFigurePositions2,
            selectedFigure: null,
            selectedFigure2: null,
            selectedFigure3: null,
          });
        } else {
          /* Next Turn: First Player */
          turn1P = true;
        
          /* Updates the state */
          this.setState({
            figurePositions2P: newFigurePositions,
            figurePositions1P: newFigurePositions2,
            selectedFigure: null,
            selectedFigure2: null,
            selectedFigure3: null,
          });
        }
      } else {
        this.selectionFigure(row, col, figurePositions);
      }
    /* Checks if the move with 2 Figure can be made, and fulfills it in case it works */
    } else if(selectedFigure && selectedFigure2) {
      if(this.checkPossibleMovesTwoFigures(row, col, selectedFigure.row, selectedFigure.col, selectedFigure2.row, selectedFigure2.col)) {
        /* New list of First Player and Second Player Figures' Positions */
        let newFigurePositions = figurePositions;
        let newFigurePositions2 = figurePositions2;

        /* Remove all Figures, which matches with the selected ones */
        newFigurePositions = newFigurePositions.filter(pos => !(pos.row === selectedFigure.row && pos.col === selectedFigure.col));
        newFigurePositions = newFigurePositions.filter(pos => !(pos.row === selectedFigure2.row && pos.col === selectedFigure2.col));

        /* Case, where the Selections are horizontal ( - ) */
        if(selectedFigure.row === selectedFigure2.row && selectedFigure.col-1 === selectedFigure2.col) {
          if((selectedFigure.row === row && selectedFigure.col+1 === col) || (selectedFigure.row-1 === row && selectedFigure.col === col) || (selectedFigure.row+1 === row && selectedFigure.col+1 === col)) {
            /* Add the Figures to the clicked and adjacent Positions */
            newFigurePositions.push({ row: row, col: col });
            newFigurePositions.push({ row: row, col: col-1 });

            if(collision) {
              newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row && pos.col === col));

              if(this.isInBoardRows(row, col+1))
                newFigurePositions2.push({ row: row, col: col+1 });

              collision = false;
            }
          } else {
            newFigurePositions.push({ row: row, col: col });
            newFigurePositions.push({ row: row, col: col+1 });

            if(collision) {
              newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row && pos.col === col));

              if(this.isInBoardRows(row, col-1))
                newFigurePositions2.push({ row: row, col: col-1 });

              collision = false;
            }
          }
        /* Case, where the Selections are diagonal from bottom right to top left ( \ ) */
        } else if(selectedFigure.col-1 === selectedFigure2.col && selectedFigure.row-1 === selectedFigure2.row) {
          if((selectedFigure.row+1 === row && selectedFigure.col+1 === col) || (selectedFigure.row === row && selectedFigure.col+1 === col) || (selectedFigure.row+1 === row && selectedFigure.col === col)) {
            /* Add the Figures to the clicked and adjacent Positions */
            newFigurePositions.push({ row: row, col: col });
            newFigurePositions.push({ row: row-1, col: col-1 });

            if(collision) {
              newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row && pos.col === col));

              if(this.isInBoardRows(row+1, col+1))
                newFigurePositions2.push({ row: row+1, col: col+1 });

              collision = false;
            }
          } else {
            newFigurePositions.push({ row: row, col: col });
            newFigurePositions.push({ row: row+1, col: col+1 });

            if(collision) {
              newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row && pos.col === col));

              if(this.isInBoardRows(row-1, col-1))
                newFigurePositions2.push({ row: row-1, col: col-1 });

              collision = false;
            }
          }
        /* Case, where the Selections are diagonal from bottom left to top right ( / ) */
        } else if(selectedFigure.col === selectedFigure2.col && selectedFigure.row-1 === selectedFigure2.row) {
          if((selectedFigure.row+1 === row && selectedFigure.col === col) || (selectedFigure.row+1 === row && selectedFigure.col+1 === col) || (selectedFigure.row === row && selectedFigure.col-1 === col)) {
            /* Add the Figures to the clicked and adjacent Positions */
            newFigurePositions.push({ row: row, col: col });
            newFigurePositions.push({ row: row-1, col: col });

            if(collision) {
              newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row && pos.col === col));

              if(this.isInBoardRows(row+1, col))
                newFigurePositions2.push({ row: row+1, col: col });

              collision = false;
            }
          } else {
            newFigurePositions.push({ row: row, col: col });
            newFigurePositions.push({ row: row+1, col: col });

            if(collision) {
              newFigurePositions2 = newFigurePositions2.filter(pos => !(pos.row === row && pos.col === col));

              if(this.isInBoardRows(row-1, col))
                newFigurePositions2.push({ row: row-1, col: col });

              collision = false;
            }
          }
        }
        
        if(turn1P) {
          turn1P = false;
            
          this.setState({
            figurePositions1P: newFigurePositions,
            figurePositions2P: newFigurePositions2,
            selectedFigure: null,
            selectedFigure2: null,
            selectedFigure3: null,
          });
        } else {
          turn1P = true;
        
          this.setState({
            figurePositions2P: newFigurePositions,
            figurePositions1P: newFigurePositions2,
            selectedFigure: null,
            selectedFigure2: null,
            selectedFigure3: null,
          });
        }
      } else {
        this.selectionFigure(row, col, figurePositions);
        collision = false;
      }
    /* Checks if the move with 1 Figure can be made, and fulfills it in case it works */
    } else if(selectedFigure && this.checkPossibleMoves(row, col, selectedFigure.row, selectedFigure.col)) {
      /* New list of First Player and Second Player Figures' Positions */
      let newFigurePositions = figurePositions;

      /* Remove all Figures, which matches with the selected ones */
      newFigurePositions = newFigurePositions.filter(pos => !(pos.row === selectedFigure.row && pos.col === selectedFigure.col));

      /* Add the Figure to the clicked Position */
      newFigurePositions.push({ row: row, col: col });

      if(turn1P) {
        turn1P = false;
          
        this.setState({
          figurePositions1P: newFigurePositions,
          selectedFigure: null,
          selectedFigure2: null,
          selectedFigure3: null,
        });
      } else {
        turn1P = true;
      
        this.setState({
          figurePositions2P: newFigurePositions,
          selectedFigure: null,
          selectedFigure2: null,
          selectedFigure3: null,
        });
      }
    } else {
      this.selectionFigure(row, col, figurePositions);
    }
  }

  /* Select a new Figure */
  selectionFigure(row: number, col: number, figurePositions: Array<{ row: number, col: number }>) {
    const { selectedFigure, selectedFigure2, selectedFigure3 } = this.state;

    /* Select a Figure for the movement (selectedFigure) */
    const clickedPosition = figurePositions.find(pos => pos.row === row && pos.col === col);

    /* In case the clickedPosition is false, we don't do anything, since the clickedPosition has no event */
    if(clickedPosition) {
      /* These if conditions puts the selectedFigures into a correct order 
      /* Descendent order: Horizontal: 7,8 -> 7,7 -> 7,6 
      /*                || Diagonal Left Bottom to Right Top: 7,9 -> 6,9 -> 5,9
      /*                || Diagonal Right Bottom to Left Top: 3,3 -> 2,2 -> 1,1))
      /* While checking the current case (How many Figures are selected? What new Position is selected?) */
      if(selectedFigure && selectedFigure2 && selectedFigure3 && this.isThirdSelection(row, col, selectedFigure2.row, selectedFigure2.col, selectedFigure3.row, selectedFigure3.col)) {
        this.setState({ 
          selectedFigure: selectedFigure2,
          selectedFigure2: selectedFigure3,
          selectedFigure3: clickedPosition,
        });
      } else if(selectedFigure && selectedFigure2 && this.isThirdSelection(row, col, selectedFigure.row, selectedFigure.col, selectedFigure2.row, selectedFigure2.col)) {
        if((row > selectedFigure.row) || (col > selectedFigure.col && row === selectedFigure.row)) {
          this.setState({ 
            selectedFigure3: selectedFigure2,
            selectedFigure2: selectedFigure,
            selectedFigure: clickedPosition,
          });
        } else if((row > selectedFigure2.row) || (col > selectedFigure2.col && row === selectedFigure2.row)) {
          this.setState({ 
            selectedFigure3: selectedFigure2,
            selectedFigure2: clickedPosition,
          });
        } else {
          this.setState({ 
            selectedFigure3: clickedPosition,
          });
        }
      } else if(selectedFigure && this.isAdjacent(row, col, selectedFigure.row, selectedFigure.col)) {
        if((row > selectedFigure.row) || (col > selectedFigure.col)) {
          this.setState({ 
            selectedFigure2: selectedFigure,
            selectedFigure: clickedPosition,
            selectedFigure3: null,
          });
        } else {
          this.setState({ 
            selectedFigure2: clickedPosition,
            selectedFigure3: null,
          });
        }
      /* In case no connection can be made, the clickedPosition is a single new selectedFigure */
      } else {
        this.setState({ 
          selectedFigure: clickedPosition,
          selectedFigure2: null,
          selectedFigure3: null,
        });
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

  /* Checks if the clicked Position can be the selectedFigure3 */
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

  /* Checks if the given Position with the parameters is inside the Board */
  isInBoardRows(row: number, col: number) {
    var isFigureIn = false;

    for (let i = 1; i < boardRows.length+1; i++) {
      for (let j = 1; j < boardRows[i-1]+1; j++) {
        var adjustedJ = j;

        if(i > 5) {
          adjustedJ = j+(i-5);
        }
        
        if (row === i && col === adjustedJ) {
          isFigureIn = true;
        }
      }
    }

    return isFigureIn;
  }

  /* Returns a list of all the possible moves that a single Figure can do */
  calculatePossibleMoves(row: number, col: number, sRow: number, sCol: number): {row: number, col: number}[] {
    const { figurePositions1P, figurePositions2P } = this.state;
    const possibleMoves: {row: number, col: number}[] = [];

    /* Checks if the clicked Position is the same as the Position of a First Player or Second Player Figure */
    const isFigureAnd1P = figurePositions1P.some(pos => pos.row === row && pos.col === col);
    const isFigureAnd2P = figurePositions2P.some(pos => pos.row === row && pos.col === col);

    /* Goes through all the Hexagon Fields and checks where the selectedFigure could move to with the isAdjacent function */
    for (let i = 1; i < boardRows.length+1; i++) {
      for (let j = 1; j < boardRows[i-1]+1; j++) {
        var adjustedJ = j;

        if(i > 5) {
          adjustedJ = j+(i-5);
        }
        if (this.isAdjacent(sRow, sCol, i, adjustedJ) && !isFigureAnd1P && !isFigureAnd2P) {
          possibleMoves.push({ row: i, col: adjustedJ });
        }
      }
    }

    return possibleMoves;
  }

  /* Checks if the given Position with the parameters is a Figure */
  isFigure(row: number, col: number): boolean {
    const { figurePositions1P, figurePositions2P } = this.state;
    const isFigureAnd1P = figurePositions1P.some(pos => pos.row === row && pos.col === col);
    const isFigureAnd2P = figurePositions2P.some(pos => pos.row === row && pos.col === col);
    
    return isFigureAnd1P || isFigureAnd2P;
  }

  /* Checks if a Collision between different colored Figures has happened */
  isCollision(row: number, col: number): boolean {
    const { figurePositions1P, figurePositions2P } = this.state;
    
    var isCollision;

    if(turn1P) {
      isCollision = figurePositions1P.some(pos => pos.row === row && pos.col === col);
    } else {
      isCollision = figurePositions2P.some(pos => pos.row === row && pos.col === col);
    }

    return isCollision;
  }

  /* Checks if the given Position with the parameters has no Figure */
  isSpace(row: number, col: number): boolean {
    var isSpace = false;

    if(!this.isFigure(row, col)) {
      isSpace = true;
    }

    return isSpace;
  }

  /* Returns a list of all the possible moves that 2 Figures can do */
  calculatePossibleMovesTwoFigures(row: number, col: number, sRow: number, sCol: number, sRow2: number, sCol2: number): {row: number, col: number}[] {
    const possibleMoves: {row: number, col: number}[] = [];

    /* All the possible Moves */
    if(sRow === sRow2 && sCol-1 === sCol2) {
      if(!this.isCollision(sRow, sCol+1) && this.isSpace(sRow, sCol+2)) {
        possibleMoves.push({ row: sRow, col: sCol+1 });
      } else if(!this.isFigure(sRow, sCol+1)) {
        possibleMoves.push({ row: sRow, col: sCol+1 });
      }
      if(!this.isCollision(sRow2, sCol2-1) && this.isSpace(sRow2, sCol2-2)) {
        possibleMoves.push({ row: sRow2, col: sCol2-1 });
      } else if(!this.isFigure(sRow2, sCol2-1)) {
        possibleMoves.push({ row: sRow2, col: sCol2-1 });
      }
      if(!this.isFigure(sRow-1, sCol) && !this.isFigure(sRow-1, sCol-1)) {
        possibleMoves.push({ row: sRow-1, col: sCol });
      }
      if(!this.isFigure(sRow+1, sCol+1) && !this.isFigure(sRow+1, sCol)) {
        possibleMoves.push({ row: sRow+1, col: sCol+1 });
      }
      if(!this.isFigure(sRow2-1, sCol2-1) && !this.isFigure(sRow2-1, sCol2)) {
        possibleMoves.push({ row: sRow2-1, col: sCol2-1 });
      }
      if(!this.isFigure(sRow2+1, sCol2) && !this.isFigure(sRow2+1, sCol2+1)) {
        possibleMoves.push({ row: sRow2+1, col: sCol2 });
      }
    } else if(sCol-1 === sCol2 && sRow-1 === sRow2) {
      if(!this.isCollision(sRow+1, sCol+1) && this.isSpace(sRow+2, sCol+2)) {
        possibleMoves.push({ row: sRow+1, col: sCol+1 });
      } else if(!this.isFigure(sRow+1, sCol+1)) {
        possibleMoves.push({ row: sRow+1, col: sCol+1 });
      }
      if(!this.isCollision(sRow2-1, sCol2-1) && this.isSpace(sRow2-2, sCol2-2)) {
        possibleMoves.push({ row: sRow2-1, col: sCol2-1 });
      } else if(!this.isFigure(sRow2-1, sCol2-1)) {
        possibleMoves.push({ row: sRow2-1, col: sCol2-1 });
      }
      if(!this.isFigure(sRow, sCol+1) && !this.isFigure(sRow-1, sCol)) {
        possibleMoves.push({ row: sRow, col: sCol+1 });
      }
      if(!this.isFigure(sRow+1, sCol) && !this.isFigure(sRow, sCol-1)) {
        possibleMoves.push({ row: sRow+1, col: sCol });
      }
      if(!this.isFigure(sRow2-1, sCol2) && !this.isFigure(sRow2, sCol2+1)) {
        possibleMoves.push({ row: sRow2-1, col: sCol2 });
      }
      if(!this.isFigure(sRow2, sCol2-1) && !this.isFigure(sRow2+1, sCol2)) {
        possibleMoves.push({ row: sRow2, col: sCol2-1 });
      }
    } else if(sCol === sCol2 && sRow-1 === sRow2) {
      if(!this.isCollision(sRow+1, sCol) && this.isSpace(sRow+2, sCol)) {
        possibleMoves.push({ row: sRow+1, col: sCol });
      } else if(!this.isFigure(sRow+1, sCol)) {
        possibleMoves.push({ row: sRow+1, col: sCol });
      }
      if(!this.isCollision(sRow2-1, sCol2) && this.isSpace(sRow2-2, sCol2)) {
        possibleMoves.push({ row: sRow2-1, col: sCol2 });
      } else if(!this.isFigure(sRow2-1, sCol2)) {
        possibleMoves.push({ row: sRow2-1, col: sCol2 });
      }
      if(!this.isFigure(sRow+1, sCol+1) && !this.isFigure(sRow, sCol+1)) {
        possibleMoves.push({ row: sRow+1, col: sCol+1 });
      }
      if(!this.isFigure(sRow, sCol-1) && !this.isFigure(sRow-1, sCol-1)) {
        possibleMoves.push({ row: sRow, col: sCol-1 });
      }
      if(!this.isFigure(sRow2, sCol2+1) && !this.isFigure(sRow2+1, sCol2+1)) {
        possibleMoves.push({ row: sRow2, col: sCol2+1 });
      }
      if(!this.isFigure(sRow2-1, sCol2-1) && !this.isFigure(sRow2, sCol2-1)) {
        possibleMoves.push({ row: sRow2-1, col: sCol2-1 });
      }
    }

    return possibleMoves;
  }

  /* Returns a list of all the possible moves that 3 Figures can do */
  calculatePossibleMovesThreeFigures(row: number, col: number, sRow: number, sCol: number, sRow2: number, sCol2: number, sRow3: number, sCol3: number): {row: number, col: number}[] {
    const possibleMoves: {row: number, col: number}[] = [];

    /* All the possible Moves */
    if(sRow === sRow2 && sCol-1 === sCol2 && sRow === sRow3 && sCol-2 === sCol3) {
      if(!this.isCollision(sRow, sCol+1) && (this.isSpace(sRow, sCol+2) || (this.isSpace(sRow, sCol+3) && !this.isCollision(sRow, sCol+2)))) {
        possibleMoves.push({ row: sRow, col: sCol+1 });
      } else if(!this.isFigure(sRow, sCol+1)) {
        possibleMoves.push({ row: sRow, col: sCol+1 });
      }
      if(!this.isCollision(sRow3, sCol3-1) && (this.isSpace(sRow3, sCol3-2) || (this.isSpace(sRow3, sCol3-3) && !this.isCollision(sRow3, sCol3-2)))) {
        possibleMoves.push({ row: sRow3, col: sCol3-1 });
      } else if(!this.isFigure(sRow3, sCol3-1)) {
        possibleMoves.push({ row: sRow3, col: sCol3-1 });
      }
      if(!this.isFigure(sRow-1, sCol) && !this.isFigure(sRow-1, sCol-1) && !this.isFigure(sRow-1, sCol-2)) {
        possibleMoves.push({ row: sRow-1, col: sCol });
      }
      if(!this.isFigure(sRow+1, sCol+1) && !this.isFigure(sRow+1, sCol) && !this.isFigure(sRow+1, sCol-1)) {
        possibleMoves.push({ row: sRow+1, col: sCol+1 });
      }
      if(!this.isFigure(sRow3-1, sCol3-1) && !this.isFigure(sRow3-1, sCol3) && !this.isFigure(sRow3-1, sCol3+1)) {
        possibleMoves.push({ row: sRow3-1, col: sCol3-1 });
      }
      if(!this.isFigure(sRow3+1, sCol3) && !this.isFigure(sRow3+1, sCol3+1) && !this.isFigure(sRow3+1, sCol3+2)) {
        possibleMoves.push({ row: sRow3+1, col: sCol3 });
      }
    } else if(sCol-1 === sCol2 && sRow-1 === sRow2 && sCol-2 === sCol3 && sRow-2 === sRow3) {
      if(!this.isCollision(sRow+1, sCol+1) && (this.isSpace(sRow+2, sCol+2) || (this.isSpace(sRow+3, sCol+3) && !this.isCollision(sRow+2, sCol+2)))) {
        possibleMoves.push({ row: sRow+1, col: sCol+1 });
      } else if(!this.isFigure(sRow+1, sCol+1)) {
        possibleMoves.push({ row: sRow+1, col: sCol+1 });
      }
      if(!this.isCollision(sRow3-1, sCol3-1) && (this.isSpace(sRow3-2, sCol3-2) || (this.isSpace(sRow3-3, sCol3-3) && !this.isCollision(sRow3-2, sCol3-2)))) {
        possibleMoves.push({ row: sRow3-1, col: sCol3-1 });
      } else if(!this.isFigure(sRow3-1, sCol3-1)) {
        possibleMoves.push({ row: sRow3-1, col: sCol3-1 });
      }
      if(!this.isFigure(sRow, sCol+1) && !this.isFigure(sRow-1, sCol) && !this.isFigure(sRow-2, sCol-1)) {
        possibleMoves.push({ row: sRow, col: sCol+1 });
      }
      if(!this.isFigure(sRow+1, sCol) && !this.isFigure(sRow, sCol-1) && !this.isFigure(sRow-1, sCol-2)) {
        possibleMoves.push({ row: sRow+1, col: sCol });
      }
      if(!this.isFigure(sRow3-1, sCol3) && !this.isFigure(sRow3, sCol3+1) && !this.isFigure(sRow3+1, sCol3+2)) {
        possibleMoves.push({ row: sRow3-1, col: sCol3 });
      }
      if(!this.isFigure(sRow3, sCol3-1) && !this.isFigure(sRow3+1, sCol3) && !this.isFigure(sRow3+2, sCol3+1)) {
        possibleMoves.push({ row: sRow3, col: sCol3-1 });
      }
    } else if(sCol === sCol2 && sRow-1 === sRow2 && sCol === sCol3 && sRow-2 === sRow3) {
      if(!this.isCollision(sRow+1, sCol) && (this.isSpace(sRow+2, sCol) || (this.isSpace(sRow+3, sCol) && !this.isCollision(sRow+2, sCol)))) {
        possibleMoves.push({ row: sRow+1, col: sCol });
      } else if(!this.isFigure(sRow+1, sCol)) {
        possibleMoves.push({ row: sRow+1, col: sCol });
      }
      if(!this.isCollision(sRow3-1, sCol3) && (this.isSpace(sRow3-2, sCol3) || (this.isSpace(sRow3-3, sCol3) && !this.isCollision(sRow3-2, sCol3)))) {
        possibleMoves.push({ row: sRow3-1, col: sCol3 });
      } else if(!this.isFigure(sRow3-1, sCol3)) {
        possibleMoves.push({ row: sRow3-1, col: sCol3 });
      }
      if(!this.isFigure(sRow+1, sCol+1) && !this.isFigure(sRow, sCol+1) && !this.isFigure(sRow-1, sCol+1)) {
        possibleMoves.push({ row: sRow+1, col: sCol+1 });
      }
      if(!this.isFigure(sRow, sCol-1) && !this.isFigure(sRow-1, sCol-1) && !this.isFigure(sRow-2, sCol-1)) {
        possibleMoves.push({ row: sRow, col: sCol-1 });
      }
      if(!this.isFigure(sRow3, sCol3+1) && !this.isFigure(sRow3+1, sCol3+1) && !this.isFigure(sRow3+2, sCol3+1)) {
        possibleMoves.push({ row: sRow3, col: sCol3+1 });
      }
      if(!this.isFigure(sRow3-1, sCol3-1) && !this.isFigure(sRow3, sCol3-1) && !this.isFigure(sRow3+1, sCol3-1)) {
        possibleMoves.push({ row: sRow3-1, col: sCol3-1 });
      }
    }

    return possibleMoves;
  }

  /* Returns a true false if possible moves are available for a specific case (For moving 1 Figure) */
  checkPossibleMoves(row: number, col: number, sRow: number, sCol: number) {
    var possibleMoves: {row: number, col: number}[] = [];
    var checkMoves = false;

    possibleMoves = this.calculatePossibleMoves(row, col, sRow, sCol);

    /* Checks if the clicked Position is equal to the possibleMoves Position */
    checkMoves = possibleMoves.some(pos => pos.row === row && pos.col === col);

    return checkMoves;
  }

  /* Returns a true false if possible moves are available for a specific case (For moving 2 Figures) */
  checkPossibleMovesTwoFigures(row: number, col: number, sRow: number, sCol: number, sRow2: number, sCol2: number) {
    const { figurePositions1P, figurePositions2P } = this.state;
    var possibleMoves: {row: number, col: number}[] = [];
    var checkMoves = false;

    possibleMoves = this.calculatePossibleMovesTwoFigures(row, col, sRow, sCol, sRow2, sCol2);

    /* Checks if the clicked Position is equal to the possibleMoves Position */
    checkMoves = possibleMoves.some(pos => pos.row === row && pos.col === col);

    if(figurePositions1P.some(pos => pos.row === row && pos.col === col) || figurePositions2P.some(pos => pos.row === row && pos.col === col)) {
      collision = true;
      console.log("fish");
    }

    return checkMoves;
  }

  /* Returns a true false if possible moves are available for a specific case (For moving 3 Figures) */
  checkPossibleMovesThreeFigures(row: number, col: number, sRow: number, sCol: number, sRow2: number, sCol2: number, sRow3: number, sCol3: number) {
    const { figurePositions1P, figurePositions2P } = this.state;
    var possibleMoves: {row: number, col: number}[] = [];
    var checkMoves = false;

    possibleMoves = this.calculatePossibleMovesThreeFigures(row, col, sRow, sCol, sRow2, sCol2, sRow3, sCol3);

    /* Checks if the clicked Position is equal to the possibleMoves Position */
    checkMoves = possibleMoves.some(pos => pos.row === row && pos.col === col);

    if(figurePositions1P.some(pos => pos.row === row && pos.col === col) || figurePositions2P.some(pos => pos.row === row && pos.col === col)) {
      collision = true;
    }

    return checkMoves;
  }

  /* Updates the visualization of the current state of the webpage */
  render() {
    const { figurePositions1P, figurePositions2P, selectedFigure, selectedFigure2, selectedFigure3 } = this.state;
    return (
      <div className="hexboard_container">
        <div className="hexboard">
          <div className="score_container" >
            <div className="side_by_side">
              <div className="circle_score" style={{ backgroundColor: "white"}} />
              <span className="circle_number" style={{ color: "white", marginLeft: "10px"}} >{14-figurePositions1P.length}</span>
            </div>
            <div className="side_by_side" style={{ marginTop: "5px" }} >
              <div className="circle_score" style={{ backgroundColor: "black"}} />
              <span className="circle_number" style={{ color: "black", marginLeft: "10px" }} >{14-figurePositions2P.length}</span>
            </div>
          </div>
        
          {boardRows.map((numHexagons, i) => {
            const hexagons = Array.from({ length: numHexagons }, (_, j) => {

              if(figurePositions1P.length === 8) {
                window.alert("Second Player Won!");
              } else if(figurePositions2P.length === 8) {
                window.alert("First Player Won!");
              }

              /* Guarantees that the Positions of each Hexagon Field is convenient to work with it */
              let adjustedI = i+1;
              let adjustedJ = j+1;

              if(adjustedI > 5) {
                adjustedJ = adjustedJ+(i-4);
              }

              var possibleMoves: {row: number, col: number}[] = [];

              /* calculatePossibleMoves depending on how much Figures are selected (up to 3) */
              if(selectedFigure && selectedFigure2 && selectedFigure3) {
                possibleMoves = this.calculatePossibleMovesThreeFigures(adjustedI, adjustedJ, selectedFigure.row, selectedFigure.col, selectedFigure2.row, selectedFigure2.col, selectedFigure3.row, selectedFigure3.col);
              } else if(selectedFigure && selectedFigure2) {
                possibleMoves = this.calculatePossibleMovesTwoFigures(adjustedI, adjustedJ, selectedFigure.row, selectedFigure.col, selectedFigure2.row, selectedFigure2.col);
              } else if(selectedFigure) {
                possibleMoves = this.calculatePossibleMoves(adjustedI, adjustedJ, selectedFigure.row, selectedFigure.col);
              }

              /* Checks the Position of each element */
              const isFigureAnd1P = figurePositions1P.some(pos => pos.row === adjustedI && pos.col === adjustedJ);
              const isFigureAnd2P = figurePositions2P.some(pos => pos.row === adjustedI && pos.col === adjustedJ);
              const isFigureAndSelected = selectedFigure?.row === adjustedI && selectedFigure?.col === adjustedJ;
              const isFigureAndSelected2 = selectedFigure2?.row === adjustedI && selectedFigure2?.col === adjustedJ;
              const isFigureAndSelected3 = selectedFigure3?.row === adjustedI && selectedFigure3?.col === adjustedJ;
              const isPossibleMoves = possibleMoves.some(pos => pos.row === adjustedI && pos.col === adjustedJ);

              /* Visualization */
              var movesColor;
              if(turn1P) {
                movesColor = "rgba(255, 255, 255, 0.5)";
              } else {
                movesColor = "rgba(0, 0, 0, 0.5)";
              }

              return (
                <div key={`${adjustedI}-${adjustedJ}`} className="hexagon_wrapper" >
                  <HexagonIcon className="hexagon" style={{ fontSize: "120px" }} />
                  {isFigureAnd1P && (
                    <div className={`circle1P ${turn1P ? "turn1P_circle" : ""}`} onClick={() => this.handleHexClick(adjustedI, adjustedJ)} />
                  )}
                  {isFigureAnd2P && (
                    <div className={`circle2P ${turn1P ? "" : "turn2P_circle"}`} onClick={() => this.handleHexClick(adjustedI, adjustedJ)} />
                  )}
                  {isFigureAndSelected && (
                    <div className="small_circle" style={{ backgroundColor: "rgba(0, 114, 0, 0.5)", pointerEvents: "none" }} />
                  )}
                  {isFigureAndSelected2 && (
                    <div className="small_circle" style={{ backgroundColor: "rgba(0, 114, 0, 0.5)", pointerEvents: "none" }} />
                  )}
                  {isFigureAndSelected3 && (
                    <div className="small_circle" style={{ backgroundColor: "rgba(0, 114, 0, 0.5)", pointerEvents: "none"  }} />
                  )}
                  {isPossibleMoves && (
                    <div className={`small_circle ${turn1P ? "turn1P_sCircle" : "turn2P_sCircle"}`} style={{ backgroundColor: `${movesColor}`, width: "50px", height: "50px" }} onClick={() => this.handleHexClick(adjustedI, adjustedJ)} />
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