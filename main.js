const gameboard = (function() {
    let boardArr = ['', '', '', '', '', '', '', '', ''];

    const setMark = (index, mark) => {
        if(index > boardArr.length){ 
            return;
        }
        boardArr[index] = mark;
    };

    const getMark = (index) => {
        if(index > boardArr.length){
            return;
        }
        return boardArr[index];
    };

    const resetArray = () => {
        for (let i = 0; i < boardArr.length; i++){
            boardArr[i] = '';
        }
    };

    const checkWinner = () => {
        let winner = null;
        const winArr = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        winArr.forEach((combo) => {
            let c0 = boardArr[combo[0]];
            if((c0 !== '' ) &&
                (c0 === boardArr[combo[1]]) &&
                (c0 === boardArr[combo[2]])){
                winner = c0;
            }
        });
        return winner || (boardArr.includes('') ? null : "tie");
    }; 

    const getAvailableMoves = () => {
        let availableMoves = [];
        boardArr.filter((data, i) => {
            if(data === ''){
                availableMoves.push(i);
            }
        })
        return availableMoves;
    }

    return { 
        setMark, getMark, resetArray, checkWinner, getAvailableMoves
    };
})();

const Player = (mark) => {    
    getMark = () => mark;

   return{
        getMark
   }
}; 

const displayController = (function() {
    const board = document.querySelector('#board');
    const cells = Array.from(document.querySelectorAll('.cell'));
    const message = document.querySelector('#message');
    const restart = document.querySelector('#restart-btn');
    const modeBtns = document.querySelectorAll('.mode');
    const game = document.querySelector('#game');
    const modeSelection = document.querySelector('#modes');
    const changeMode = document.querySelector('#mode-btn');
    let curMode;

    modeBtns.forEach((button) => {
        button.addEventListener('click', (e) => {
            let m = e.target.id;
            if(m === "human"){
                curMode = m;
            }
            else if(m === "ai"){
                curMode = m;
            } 
            modeSelection.classList.add('hide');
            game.classList.remove('hide-gameboard');
        })
    })

    board.addEventListener("click" , (e) => {
        if(gameController.isDone() || e.target.textContent !== ''){ 
            return;
        }
        gameController.gameRound(curMode, parseInt(e.target.dataset.index));
        e.target.classList.remove("free");
        renderBoard();
    });

    changeMode.addEventListener("click", () => {
        resetGame();
        modeSelection.classList.remove('hide');
        game.classList.add('hide-gameboard');
    })

    const setResults = (msg) => {
        setMessage(msg);
        message.classList.add("won");
    }

    const setMessage = (msg) => {
        message.textContent = msg;
    }

    const resetBoard = () => {
        cells.forEach((cell)  => {
            cell.classList.add('free');
        });    
    }

    const renderBoard = () => {
        for(let i = 0; i < cells.length; i++){
            cells[i].textContent = gameboard.getMark(i);

        }
    };

    const resetGame = () => {
        gameboard.resetArray();
        gameController.resetGame();
        resetBoard();
        renderBoard();
        displayController.setMessage("Player X's turn");
        message.classList.remove("won");
    }
    restart.addEventListener("click", resetGame)

    return { 
        renderBoard, setMessage, setResults 
    };
})();

const gameController = (function() {
    let playerX = Player("X");
    let playerO = Player("O"); 
    let curPlayer = playerX;
    let isGameDone = false;

    const changePlayer = () => {
        curPlayer = curPlayer === playerX ? playerO : playerX;
    };

    const changeTurn =  () => {
        changePlayer();
        displayController.setMessage(`Player ${curPlayer.getMark()}'s turn`);
        console.log(curPlayer.getMark());
        
    }



    // const gameRound = (curMode, index) => {
    //     gameboard.setMark(index, curPlayer.getMark());
    //     let winner = gameboard.checkWinner();

    //     if(winner === "tie"){
    //         displayController.setResults("It's a tie!");
    //         isGameDone = true;
            
    //     }
    //     else if(winner !== "tie" && winner !== null){
    //         displayController.setResults("Player " + winner + " is the Winner!");
    //         isGameDone = true;
    //     }
    //     else if(winner === null && curMode === "ai"){
    //         computerPlay();
    //     }
    //     else{
    //         changeTurn();
    //     }
    // }

    const getResults = () => {
        let winner = gameboard.checkWinner();
        if(winner === "tie"){
            displayController.setResults("It's a tie!");
            isGameDone = true;
            return "tie";
            
        }
        else if(winner !== "tie" && winner !== null){
            displayController.setResults("Player " + winner + " is the Winner!");
            isGameDone = true;
            return "winner";
        }
        return null;       
    }

    const computerPlay = () => {
        changeTurn();
        let availableMoves = gameboard.getAvailableMoves();
        let i = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        setTimeout(function (){
            gameboard.setMark(i, curPlayer.getMark());
            displayController.renderBoard();
            if(!getResults()){
                changeTurn();
            }
        }, 500);
    }

    const gameRound = (curMode, index) => {
        gameboard.setMark(index, curPlayer.getMark());
        let isDone = getResults();
        if(!isDone && curMode === "human"){
            changeTurn();
        }
        else if(!isDone && curMode === "ai"){
            computerPlay();  
        }
    };

    const isDone = () => {
        return isGameDone;
    };

    const resetGame = () => {
        isGameDone = false;
    }

    return { 
        isDone, gameRound, resetGame 
    };
})();