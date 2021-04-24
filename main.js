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
            board[i] = '';
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
        return { winner }
    }; 

    return { setMark, getMark, resetArray, checkWinner};
})();

const Player = (mark) => {
    
    // getName = () => name;
    getMark = () => mark;

    // const sayName = () => console.log(`Player ${mark} is ${name}`);
    // return{
    //     sayName 
    // };

   return{
        // getName,
        // sayName,
        getMark
   }
}; 

const displayController = (function() {
    const gameboard = document.querySelector('#board');
    const cells = Array.from(document.querySelectorAll('.cell'));

})();

const gameController = (function() {
    let curPlayer = null;
    let Player 
})();

