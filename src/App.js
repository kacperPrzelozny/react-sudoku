import React, { useState } from 'react';
import './App.css';

function App() {
    const optionsNumbers = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ]
    const [file, setFile] = useState(null);
    const [sudoku, setSudoku] = useState([]);
    const [solvedSudoku, setSolvedSudoku] = useState([]);
    const [hint, setHint] = useState(false)
    const [erase, setErase] = useState(false)
    const [number, setNumber] = useState(0)
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFile(file);
            const fileContent = JSON.parse(reader.result);
            setSudoku(fileContent.sudoku);
            let s = JSON.parse(JSON.stringify(fileContent.sudoku))
            let toSolve = []
            for (let i = 0; i < 9; i++){
                let row = []
                for(let j = 0; j < 9; j++){
                    row.push(s[i][j].value)
                }
                toSolve.push(row)
            }
        };
        reader.readAsText(file);
    }

    const handleHint = () => {
        hint ? setHint(false) : setHint(true)
    }

    const handleErase = () => {
        erase ? setErase(false) : setErase(true)
    }

    const handleNumberChange = (number) => {
        setNumber(number)
    }

    const handleCellChange = (row, col) => {
        let s = JSON.parse(JSON.stringify(sudoku))
        let cell = JSON.parse(JSON.stringify(s[row][col]))
        let toSolve = []
        for (let i = 0; i < 9; i++){
            let row = []
            for(let j = 0; j < 9; j++){
                row.push(s[i][j].value)
            }
            toSolve.push(row)
        }
        let solvedSudoku = solveSudoku(toSolve).solvedSudoku
        if(cell.isChangeable){
            if(erase) {
                cell.value = 0
                cell.hints = []
            }
            else if(hint && number !== 0){
                !cell.hints.includes(number) ? cell.hints.push(number) : cell.hints.splice(cell.hints.indexOf(number), 1)

            }
            else if(number !== 0) {
                cell.value = number
                cell.hints = []
                if(cell.value === solvedSudoku[row][col]){
                    cell.isCorrect = true
                }
            }
        }

        s[row][col] = cell
        setSudoku(s)
    }

    const hintsToText = (hints) => {
        let text = ""
        hints.sort().map(hint => {
            text += ` ${hint}`
        })
        return text.trim()
    }

    const cells = sudoku.map((row,indexRow)=>{
        return (
            <div className="row">
                {
                    row.map((cell, indexCol)=>{
                        let cellClassNames = "cell"

                        if( ((indexRow + 1) % 2 === 1 && (indexCol + 1) % 2 === 1) || ((indexRow + 1) % 2 === 0 && (indexCol + 1) % 2 === 0) ) cellClassNames += " cell-odd"
                        else cellClassNames += " cell-even"

                        let valueClassNames = "value"

                        if(cell.isChangeable && cell.isCorrect) valueClassNames += " correct"
                        else if(cell.isChangeable && !cell.isCorrect) valueClassNames += " incorrect"

                        return (
                            <div className={cellClassNames} onClick={() => handleCellChange(indexRow, indexCol)}>
                                <div className="hint">{hintsToText(cell.hints)}</div>
                                <div className={valueClassNames}>{cell.value !== 0 ? cell.value : ""}</div>
                            </div>
                        )
                    })
                }
            </div>
        )
    })

    const options = optionsNumbers.map(row=>{
        return (
            <div className="number-row">
                {
                    row.map(optionNumber=>{
                        let numberCellClass = "number-button"
                        if(optionNumber === number){
                            numberCellClass += " picked"
                        }
                        return (
                            <div className="number-cell">
                                <button className={numberCellClass} onClick={()=>handleNumberChange(optionNumber)}>{optionNumber}</button>
                            </div>
                        )
                    })
                }
            </div>
        )
    })

    function isValid(board, row, col, k) {
        for (let i = 0; i < 9; i++) {
            const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
            const n = 3 * Math.floor(col / 3) + i % 3;
            if (board[row][i] === k || board[i][col] === k || board[m][n] === k) {
                return false;
            }
        }
        return true;
    }


    function solveSudoku(data) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (data[i][j] === 0) {
                    for (let k = 1; k <= 9; k++) {
                        if (isValid(data, i, j, k)) {
                            data[i][j] = k;
                            if (solveSudoku(data).message) {
                                return {message: true, solvedSudoku:data};
                            } else {
                                data[i][j] = 0;
                            }
                        }
                    }
                    return {message: false};
                }
            }
        }
        return {message: true, solvedSudoku:data};
    }

    const showSolvedSudoku = () => {
        let s = JSON.parse(JSON.stringify(sudoku))
        let toSolve = []
        for (let i = 0; i < 9; i++){
            let row = []
            for(let j = 0; j < 9; j++){
                row.push(s[i][j].value)
            }
            toSolve.push(row)
        }
        let solvedSudoku = solveSudoku(toSolve).solvedSudoku

        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                let cell = JSON.parse(JSON.stringify(s[i][j]))
                cell.value = solvedSudoku[i][j]
                cell.isChangeable = false
                cell.isCorrect = true
                cell.hints = []
                s[i][j] = JSON.parse(JSON.stringify(cell))
            }
        }
        setSudoku(s)
    }

  return (
    <div className="container">
      <div className="fileUploadBox">
          <label htmlFor="file-upload" className="custom-file-upload">
              <i className="fa fa-cloud-upload"></i> Upload File
          </label>
          <input id="file-upload" type="file" onChange={handleFileChange}/>
      </div>
      <div className="boardBox">
        <div className="board">
            {cells}
        </div>
      </div>
        <div className="buttons">
            <button className="solve" onClick={showSolvedSudoku}>Solve</button>
            <div className="checkbox-group">
                <label htmlFor="hint">Hint</label>
                <input type="checkbox" id="hint" onChange={handleHint}/>
            </div>
            <div className="checkbox-group">
                <label htmlFor="erase">Erase</label>
                <input type="checkbox" id="erase" onChange={handleErase}/>
            </div>
            <div className="number-buttons">
                {options}
            </div>
        </div>
    </div>
  );
}

export default App;
