"use strict";
// UI VARS
const resetBtn: HTMLButtonElement = document.querySelector(".reset-btn")!;
const boardElm: HTMLElement = document.querySelector(".board")!;
const playerElm: HTMLElement = document.querySelector(".player")!;
const historiesElm: HTMLElement = document.querySelector(".histories")!;
// LOGIC VARS
const KEYS = {
    BOARDS: "keys/boards",
    STEP: "keys/step",
};
//////////////////////////////////////
function setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
}

// function getItem(key: string, defaultValue: any): any {
//     return JSON.parse(localStorage.getItem(key))  defaultValue;
// }

function removeItem(key: string): void {
    localStorage.removeItem(key);
}

function clear(): void {
    localStorage.clear();
}
/////
let boards: string[][] = [new Array(9).fill(null)];
let currentStep: number =  boards.length - 1;
let nextPlayer: string = currentStep % 2 === 0 ? "X" : "O";
let winner: string | null = null;

function getWinner(board: string[]): string | null {
    const winnerCondensations: number[][] = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    function check(first: string | null, second: string | null): boolean | null {
        if (first === null || second === null)
            return null;
        else
            return first === second;
    }

    for (let [a, b, c] of winnerCondensations) {
        if (check(board[a], board[b]) && check(board[b], board[c]))
            return board[a];
    }

    return null;
}

// HANDLE FUNCTIONS
function handleCell(cellIdx: number): void {
    if (winner)
        return;

    const nextBoard: string[] = [...boards[currentStep]];

    if (nextBoard[cellIdx])
        return;

    currentStep++;
    nextBoard[cellIdx] = nextPlayer;

    if (currentStep < boards.length)
        boards.splice(currentStep, boards.length);

    boards.push(nextBoard);
    setItem(KEYS.BOARDS, boards);
    setItem(KEYS.STEP, currentStep);

    renderBoard(nextBoard);
    renderHistories();
}

function handleReset(): void {
    currentStep = 0;
    boards = [new Array(9).fill(null)];
    winner = null;
    nextPlayer = "X";
    clear();
    renderBoard(boards[currentStep]);
    renderHistories();
}

function handleHistory(stepIdx: number): void {
    currentStep = stepIdx;
    setItem(KEYS.STEP, stepIdx);
    renderBoard(boards[currentStep]);
    renderHistories();
}

// UI FUNCTIONS
function renderBoard(board: string[] = []): void {
    const cellElms: HTMLCollectionOf<Element> = boardElm.children;

    for (let i = 0; i < cellElms.length; i++) {
        const cell: string | null = board[i];
        const cellElm: HTMLElement = cellElms[i] as HTMLElement;

        cellElm.innerText = cell || "";
        cellElm.onclick = () => handleCell(i);
    }

    renderPlayer();
}

function renderHistories(): void {
    const historiesCount: number = boards.length;
    historiesElm.innerHTML = "";

    for (let i:number = 0; i < historiesCount; i++) {
        const historyBtn: HTMLButtonElement = document.createElement("button");
        const isCurrent: boolean = i === currentStep;
        let message: string = i === 0 ? "Go to game start" : `Go to move #${i}`;

        if (isCurrent) {
            historyBtn.disabled = true;
            historyBtn.classList.add("disabled");
            message += "(current)";
        }

        historyBtn.innerText = message;
        historyBtn.onclick = () => handleHistory(i);
        historiesElm.appendChild(historyBtn);
    }
}

function renderPlayer(): void {
    winner = getWinner(boards[currentStep]);

    const currentPlayer: string = currentStep % 2 === 0 ? "O" : "X";
    nextPlayer = currentStep % 2 === 0 ? "X" : "O";

    if (winner)
        playerElm.innerText = `Winner ${currentPlayer}`;
    else {
        playerElm.innerText = `Next Player: ${nextPlayer}`;
    }
}
// LOGIC FUNCTIONS
function startGame(): void {
    renderBoard(boards[currentStep]);
    renderHistories();
    resetBtn.addEventListener("click", handleReset);
}

function init(): void {
    startGame();
}

init();


