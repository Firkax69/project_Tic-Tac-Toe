"use strict";

/* This pattern encapsulates the game board functionality, ensuring that the internal state of the board is protected and only accessible through the provided interface. */
/* creates a Player object */
const Player = (sign) => {
    this.sign = sign;

    const getSign = () => { /* closure. It captures the sign parameter from the outer function. */
        return sign;
    };

    return { getSign }; /*  returns an object with a method getSign.  called on a Player object to retrieve its sign. */
}

/* This pattern encapsulates the game board functionality, ensuring that the internal 
state of the board is protected and only accessible through the provided interface. */
const gameBoard = (() => { /* immediately invoked function expression (IIFE) */
    const board = ["", "", "", "", "", "", "", "", ""]; /*  Array representing the game board */

    const setField = (index, sign) => { // Function to set a field on the board
        if (index > board.length) return; // Check if index is out of bounds
        board[index] = sign; // Set the specified index on the board to the given sign
    }

    const getField = (index) => { // Function to get the value of a field on the board
        if (index > board.length) return; // Check if index is out of bounds
        return board[index]; // Return the value of the specified index on the board
    }

    const reset = () => { // Function to reset the board
        for (let i = 0; i < board.length; i++) {
            board[i] = ""; // Reset each field on the board to an empty string
        }
    };

    return { setField, getField, reset }; // Return an object containing the functions that are accessible outside the module
})();



const displayController = (() => {
    const fieldElements = document.querySelectorAll(".field");
    const messageElement = document.getElementById("message");
    const restartButton = document.getElementById("restart-button");

    /*  sets up event listeners for each field on the game board. When a field is clicked, 
    it checks if the game is still ongoing and if the field is empty. If both conditions are met, 
    it plays a round by calling gameController.playRound() and updates the game board UI. */
    fieldElements.forEach((field) =>
        field.addEventListener("click", (e) => {
            if (gameController.getIsOver() || e.target.textContent !== "") return; // If game is over or field is already filled, do nothing
            gameController.playRound(parseInt(e.target.dataset.index));
            updateGameboard();
        })
    );

    /* when the restart button is clicked, the game board and controller are reset, the UI is updated, 
    and a message is displayed indicating it's Player X's turn. This effectively resets the game to its initial state. */
    restartButton.addEventListener("click", (e) => {
        gameBoard.reset();
        gameController.reset();
        updateGameboard();
        setMessageElement("Player X's turn");
      });

    /* updates the text content of each field element on the UI to match the current state of the game board. 
    Each field element will display the sign (e.g., "X" or "O") 
    that corresponds to the content of the respective field on the game board. */
    const updateGameboard = () => {
        for (let i = 0; i < fieldElements.length; i++) {
            fieldElements[i].textContent = gameBoard.getField(i);
        }
    }

    /* this function dynamically sets the result message based on the outcome of the game. */
    const setResultMessage = (winner) => {
        if (winner === "Draw") {
            setMessageElement("It's a draw!");
        } else {
            setMessageElement(`Player ${winner} has won!`);
        }
    };

    /* whenever setMessageElement is called with a message, 
    it updates the text content of the messageElement in the UI to display that message. */
    const setMessageElement = (message) => {
        messageElement.textContent = message;
    };

    /* This return statement allows other parts of the program to access and use these methods 
    to set the result message and update the message element in the UI. */
    return { setResultMessage, setMessageElement };

})();




const gameController = (() => {
    const playerX = Player("X"); // Create a player with sign "X"
    const playerO = Player("O"); // Create a player with sign "O"
    let round = 1; // Initialize round number
    let isOver = false; // Initialize game over flag

    const playRound = (fieldIndex) => {
        gameBoard.setField(fieldIndex, getCurrentPlayerSign()); // Set the field with the current player's sign
        if (checkWinner(fieldIndex)) { // Check if there's a winner after this round
            displayController.setResultMessage(getCurrentPlayerSign()); // Display result message for winner
            isOver = true; // Set game over flag to true
            return;
        }
        if (round === 9) { // If it's the 9th round (indicating a draw)
            displayController.setResultMessage("Draw"); // Display draw message
            isOver = true; // Set game over flag to true
            return;
        }
        round++; // Otherwise, it Increment the round number
        displayController.setMessageElement(`Player ${getCurrentPlayerSign()}'s turn`); // Display message for next player's turn
    };
  
    //  this function ensures that the correct player's sign is returned based on whether the round number is odd or even
    // This allows the game to alternate between players as the rounds progress.
    const getCurrentPlayerSign = () => {
      return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
    };
  

    const checkWinner = (fieldIndex) => {
      const winConditions = [ // This array contains all possible winning combinations on the game board. 
        [0, 1, 2],            // Each sub-array represents a winning condition, where the 
        [3, 4, 5],            // three numbers are the indices of the fields that need to be filled by the same player to win.
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
  
      return winConditions // IN THE END: The function returns true if any of the filtered combinations satisfy the winning condition, indicating that the current player has won;
        .filter((combination) => combination.includes(fieldIndex)) // Filter winConditions to include only those containing the fieldIndex
        .some((possibleCombination) => // Check if any possible combination satisfies the winning condition
            possibleCombination.every( // It iterates over each combination and checks if every field in that combination is filled by the current player.
                (index) => gameBoard.getField(index) === getCurrentPlayerSign() //  It checks if the sign of the current player is present in every field of the combination.
            )
        );
    };
  

    // BELOW exposes functions for playing rounds, checking if the game is over, and resetting the game state.
    const getIsOver = () => {
      return isOver; // This function returns the value of the isOver flag, which indicates whether the game is over.
    };
  
    const reset = () => { // function resets the game state, This function is called when the game is restarted.
      round = 1;
      isOver = false;
    };
  
    // The module returns an object containing references to the: 
    // playRound, getIsOver, and reset functions, making them accessible outside the module
    return { playRound, getIsOver, reset }; 
  })();