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

    return { 
        setMark, getMark, resetArray, checkWinner
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
    const restart = document.querySelector('.restart-btn');

    board.addEventListener("click" , (e) => {
        if(gameController.isDone() || e.target.textContent !== ''){ 
            return;
        }
        gameController.gameRound(parseInt(e.target.dataset.index));
        e.target.classList.remove("free");
        renderBoard();
    });

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

    const gameRound = (index) => {
        gameboard.setMark(index, curPlayer.getMark());
        let winner = gameboard.checkWinner();

        if(winner === "tie"){
            displayController.setResults("It's a tie!");
            isGameDone = true;
            
        }
        else if(winner !== "tie" && winner !== null){
            displayController.setResults("Player " + winner + " is the Winner!");
            isGameDone = true;
        }
        else{
            changePlayer();
            displayController.setMessage(`Player ${curPlayer.getMark()}'s turn`);
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