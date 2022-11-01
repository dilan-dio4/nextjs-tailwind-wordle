import React, { useContext, useState } from 'react';
import WordleGameContext, { WordleGamePiece, letters, LetterMap } from './WordleGameContext';
import { nanoid } from 'nanoid';
import UiContext from './UiContext';

export default function GameProvider({ children }: { children: React.ReactChild | JSX.Element | JSX.Element[] }) {
    const [wordleGameState, setWordleGameState] = useState<WordleGamePiece[][]>(
        [...Array(6)].map((_) => [...Array(5)].map((_) => ({ status: 'READY', id: nanoid() }))),
    ); // Rows * Height
    const [boardIndex, setBoardIndex] = useState<[number, number]>([0, 0]);
    const [keyStatusMap, setKeyStatusMap] = useState<LetterMap>(letters.reduce((acc, letter) => ({ ...acc, [letter]: undefined }), {}) as LetterMap);
    const [answer, setAnswer] = useState<string>('');
    const [bet, setBet] = useState<number>();

    const { setIsAwaitingResponse } = useContext(UiContext);

    function resetGameStateReducer() {
        setKeyStatusMap(letters.reduce((acc, letter) => ({ ...acc, [letter]: undefined }), {}) as LetterMap);
        setIsAwaitingResponse(false);
        setBoardIndex([0, 0]);
        setWordleGameState([...Array(6)].map((_) => [...Array(5)].map((_) => ({ status: 'READY', id: nanoid() }))));
    }

    function attemptRow() {
        const row = wordleGameState[boardIndex[1]];
        const givenGuess = row.map((ele) => ele.letter).join('');

        row.forEach((letterBlock, i) => {
            if (letterBlock.letter === answer[i]) {
                letterBlock.status = 'SUCCESS-CORRECT-POSITION';
            } else if (answer.includes(letterBlock.letter!)) {
                letterBlock.status = 'SUCCESS-WRONG-POSITION';
            } else {
                letterBlock.status = 'WRONG';
            }
        });

        const givenRowAttempt = boardIndex[1] + 1;
        if (givenGuess === answer) {
            const status = 'COMPLETE-WIN';
            let payout = 0;
            if (givenRowAttempt === 1) {
                payout = bet! * 6;
            } else if (givenRowAttempt === 2) {
                payout = bet! * 4;
            } else if (givenRowAttempt === 3) {
                payout = bet! * 2.5;
            } else if (givenRowAttempt === 4) {
                payout = bet! * 1;
            } else if (givenRowAttempt === 5) {
                payout = bet! * 1;
            } else if (givenRowAttempt === 6) {
                payout = bet! / 2;
            }
            return {
                row,
                status,
                tickets: payout,
                answer,
            };
        } else if (givenRowAttempt === 6) {
            const status = 'COMPLETE-LOSS';
            return {
                row,
                status,
                answer,
            };
        } else {
            return {
                row,
            };
        }
    }

    function initGame(guessableWords: string[], wager: number) {
        function getRandom(list: string[]) {
            return list[Math.floor(Math.random() * list.length)];
        }

        const _answer = getRandom(guessableWords);
        console.log(`Hello, Developer. The answer for the current game is ${_answer}.`);
        setAnswer(_answer);
        setBet(wager);
    }

    return (
        <WordleGameContext.Provider
            value={{
                wordleGameState,
                setWordleGameState,
                boardIndex,
                setBoardIndex,
                keyStatusMap,
                setKeyStatusMap,
                resetGameStateReducer,
                attemptRow,
                initGame,
            }}
        >
            {children}
        </WordleGameContext.Provider>
    );
}
