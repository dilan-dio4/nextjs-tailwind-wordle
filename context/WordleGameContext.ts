import { createContext } from 'react';

export type BlockStatus = 'READY' | 'WRONG' | 'SUCCESS-WRONG-POSITION' | 'SUCCESS-CORRECT-POSITION' | 'FILLED';

export interface WordleGamePiece {
    letter?: string;
    status: BlockStatus;
    id: string;
    opponentStatus?: BlockStatus;
}
export const letters = [
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
] as const;
export type LetterMap = Partial<{ [k in typeof letters[number]]: undefined | 'WRONG' | 'SUCCESS-WRONG-POSITION' | 'SUCCESS-CORRECT-POSITION' }>;

interface IWordleGameContext {
    wordleGameState: WordleGamePiece[][];
    setWordleGameState: React.Dispatch<React.SetStateAction<WordleGamePiece[][]>>;
    boardIndex: [number, number];
    setBoardIndex: React.Dispatch<React.SetStateAction<[number, number]>>;
    keyStatusMap: LetterMap;
    setKeyStatusMap: React.Dispatch<React.SetStateAction<LetterMap>>;
    resetGameStateReducer: () => void;
    attemptRow(): {
        row: WordleGamePiece[];
        status?: string;
        tickets?: number;
        answer?: string;
    };
    initGame(guessableWords: string[], wager: number): void;
}

const WordleGameContext = createContext<IWordleGameContext>({} as IWordleGameContext);

export default WordleGameContext;
