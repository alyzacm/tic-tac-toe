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

    const isBoardFull = () => {
        return boardArr.includes('');
    };

    const checkWinner = (mode) => {
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
            if(mode != "minimax")
                displayController.displayWin(combo);
            }
        });
        return winner || (isBoardFull() ? null : "tie");
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
    const backToModes = document.querySelector('#mode-btn');
    let curMode;

    modeBtns.forEach((button) => {
        button.addEventListener('click', (e) => {
            let m = e.target.id;
            if(m === "human"){
                curMode = m;
            }
            else if(m === "easy"){
                curMode = m;
            } 
            else if(m === "hard"){
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
        e.target.classList.remove("free");
        gameController.gameRound(curMode, parseInt(e.target.dataset.index));
    });

    backToModes.addEventListener("click", () => {
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
            cell.classList.remove('won');
        });    
    }

    const renderBoard = () => {
        for(let i = 0; i < cells.length; i++){
            cells[i].textContent = gameboard.getMark(i);

        }
    };

    const displayWin = (combo) => {
        combo.forEach((i) => {
            cells[i].classList.add('won');
        })
    }

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
        renderBoard, setMessage, setResults, displayWin 
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
    }

    const getResults = () => {
        let winner = gameboard.checkWinner();
        if(winner === "tie"){
            displayController.setResults("It's a tie!");
            isGameDone = true;
            return winner;           
        }
        else if(winner !== "tie" && winner !== null){
            displayController.setResults("Player " + winner + " is the Winner!");
            isGameDone = true;
            return winner;
        }
        return null;       
    }

    const findBestMove = (moves, player) => {
        let bestMove;
        if(player === playerO){
            let bestScore = -10000;
            for(let i = 0; i < moves.length; i++){
                if(moves[i].score > bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        else{
            let bestScore = 10000;
            for(let i = 0; i < moves.length; i++){
                if(moves[i].score < bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }

    const minimax = (board, player, depth) => {
        let arr = board.getAvailableMoves();
        let results = board.checkWinner("minimax");

        if(results === 'X'){
            return {score: depth - 10};
        }
        else if(results === 'O'){
            return {score:10 - depth};
        }
        else if(results === "tie"){
            return {score:0};
        }

        let moves = [];
        for(let i = 0; i < arr.length; i++){
            let move = {};
            move.index = arr[i];
            board.setMark(arr[i], player.getMark());

            if(player === playerO){
                let result = minimax(board, playerX, depth + 1);
                move.score = result.score;
            }
            else{
                let result = minimax(board, playerO, depth + 1);
                move.score = result.score;
            }
            board.setMark(arr[i], '');
            moves.push(move);
        }
        return findBestMove(moves, player);
    }

    const computerPlay = (mode) => {
        changeTurn();
        let wait = 750;
        let availableMoves = gameboard.getAvailableMoves();
        let i;
        if(mode === "easy"){
            i = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
        else if(mode === "hard"){
            i = minimax(gameboard, playerO, 0).index;
        }

        setTimeout(function (){
            gameboard.setMark(i, curPlayer.getMark());
            displayController.renderBoard();
            if(!getResults()){
                changeTurn();
            }
        }, wait);
    }

    const gameRound = (curMode, index) => {
        gameboard.setMark(index, curPlayer.getMark());
        displayController.renderBoard();
        let isDone = getResults();

        if(!isDone && curMode === "human"){
            changeTurn();
        }
        else if(!isDone && curMode === "easy"){
            computerPlay(curMode);  
        }
        else if(!isDone && curMode === "hard"){
            computerPlay(curMode);
        }
    };

    const isDone = () => {
        return isGameDone;
    };

    const resetGame = () => {
        isGameDone = false;
        curPlayer = playerX;
    }

    return { 
        isDone, gameRound, resetGame 
    };
})();