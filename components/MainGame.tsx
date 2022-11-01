import { useContext, useRef, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import WordleBoard from './WordleBoard';
import Keyboard from './Keyboard';
import dynamic from 'next/dynamic';
import UiContext from '../context/UiContext';
import WordleGameContext, { LetterMap, letters } from '../context/WordleGameContext';
import { flatten, MAX_TICKET_WAGER, roundToLowerEven } from '../utils/utils';
import { useThrottledCallback } from '../utils/react-hookz';
import customToast from './customToast';
import StartGameButton from './StartGameButton';
import StatsContext from '../context/StatsContext';

const TicketsDialog = dynamic(() => import('./dialogs/Tickets'));

export default function MainGame() {
    const { resetGameStateReducer, wordleGameState, setWordleGameState, boardIndex, setBoardIndex, setKeyStatusMap, attemptRow, initGame } =
        useContext(WordleGameContext);
    const {
        isAwaitingResponse,
        isGameActive,
        setIsGameActive,
        setSelectedWager,
        selectedWager,
        tickets,
        setTickets,
        isTicketsDialogOpen,
        setIsTicketsDialogOpen,
    } = useContext(UiContext);
    const { gameFinishedReducer } = useContext(StatsContext);

    const dictionaryRef = useRef<Set<string>>();
    const gameIdRef = useRef<string>();

    const onKeyboardClick = useCallback(
        (letter: string) => {
            if (boardIndex[0] === wordleGameState[0].length || isAwaitingResponse) {
                return;
            }
            setWordleGameState((prev) => {
                const _prev = [...prev];
                _prev[boardIndex[1]][boardIndex[0]] = { ..._prev[boardIndex[1]][boardIndex[0]], status: 'FILLED', letter };
                return _prev;
            });
            setBoardIndex((indexPrev) => {
                const _indexPrev = [...indexPrev];
                _indexPrev[0] = _indexPrev[0] + 1;
                return _indexPrev as [number, number];
            });
        },
        [boardIndex, wordleGameState, setBoardIndex, setWordleGameState, isAwaitingResponse],
    ); // Keep full with all deps

    const onMetaClick = useCallback(
        (key: 'Backspace' | 'Enter') => {
            if (boardIndex[0] === 0 || isAwaitingResponse) {
                return;
            }

            if (key === 'Backspace') {
                setBoardIndex((indexPrev) => {
                    const _indexPrev = [...indexPrev];
                    _indexPrev[0] = _indexPrev[0] - 1;
                    return _indexPrev as [number, number];
                });
                setWordleGameState((prev) => {
                    const _prev = [...prev];
                    _prev[boardIndex[1]][boardIndex[0] - 1] = { ..._prev[boardIndex[1]][boardIndex[0] - 1], status: 'READY', letter: undefined };
                    return _prev;
                });
            } else if (key === 'Enter') {
                if (boardIndex[0] === wordleGameState[0].length) {
                    if (dictionaryRef.current && !dictionaryRef.current.has(wordleGameState[boardIndex[1]].map((ele) => ele.letter).join(''))) {
                        customToast({
                            type: 'error',
                            content: 'Not in game dictionary',
                            options: { position: 'top-center', id: 'not-in-game-dict', duration: 1000 },
                        });
                    } else {
                        const { row, status, tickets: wonTickets, answer } = attemptRow();
                        setWordleGameState((prev) => {
                            const _prev = [...prev];
                            _prev[boardIndex[1]] = row;
                            const _letterMap: LetterMap = {};
                            const flatGame = flatten(_prev);
                            for (const letter of letters) {
                                const allInstances = flatGame.filter((ele) => ele.letter === letter);
                                if (allInstances.some((ele) => ele.status === 'WRONG')) {
                                    _letterMap[letter] = 'WRONG';
                                } else if (allInstances.some((ele) => ele.status === 'SUCCESS-CORRECT-POSITION')) {
                                    _letterMap[letter] = 'SUCCESS-CORRECT-POSITION';
                                } else if (allInstances.some((ele) => ele.status === 'SUCCESS-WRONG-POSITION')) {
                                    _letterMap[letter] = 'SUCCESS-WRONG-POSITION';
                                }
                            }
                            setKeyStatusMap(_letterMap);
                            return _prev;
                        });
                        if (status === 'COMPLETE-WIN') {
                            gameFinishedReducer('COMPLETE-WIN');
                            setTickets((prev) => prev! + wonTickets!);
                            setIsGameActive(false);
                            gameIdRef.current = undefined;
                            customToast({
                                content: `You win ${wonTickets} ticket${wonTickets! > 1 ? 's' : ''}!`,
                                type: 'success',
                                options: { duration: 20000, position: 'top-center', id: 'you-win-toast' },
                            });
                        } else if (status === 'COMPLETE-LOSS') {
                            gameFinishedReducer('COMPLETE-LOSS');
                            setIsGameActive(false);
                            setSelectedWager(Math.min(roundToLowerEven(tickets! / 2), MAX_TICKET_WAGER)); // Decrease default wager
                            if (tickets! <= 0) {
                                setIsTicketsDialogOpen(true);
                            }
                            gameIdRef.current = undefined;
                            customToast({
                                content: `The correct word was ${answer}`,
                                type: 'info',
                                options: { duration: 20000, position: 'top-center', id: 'correct-word-toast' },
                            });
                        } else {
                            setBoardIndex((prev) => [0, prev[1] + 1]);
                        }
                    }
                } else {
                    customToast({
                        type: 'error',
                        content: 'Not enough letters',
                        options: { position: 'top-center', id: 'not-enough-letters', duration: 1000 },
                    });
                }
            }
        },
        [
            boardIndex,
            isAwaitingResponse,
            setBoardIndex,
            setWordleGameState,
            wordleGameState,
            setKeyStatusMap,
            gameFinishedReducer,
            setTickets,
            setIsGameActive,
            setSelectedWager,
            tickets,
            attemptRow,
            setIsTicketsDialogOpen,
        ],
    ); // Keep full with all deps

    const keyDownEventListener = useThrottledCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'Backspace' || event.key === 'Enter') {
                onMetaClick(event.key);
            } else if (/^[a-zA-Z]{1}$/.test(event.key)) {
                onKeyboardClick(event.key.toUpperCase());
            }
        },
        [onKeyboardClick, onMetaClick],
        25,
        true,
    );

    useEffect(() => {
        if (isGameActive) {
            document.addEventListener('keydown', keyDownEventListener);
        }
        return () => {
            document.removeEventListener('keydown', keyDownEventListener);
        };
    }, [isGameActive, keyDownEventListener]);

    async function launchGame() {
        resetGameStateReducer();
        if (!dictionaryRef.current) {
            const guessableWordsRes = await import('../assets/guessableWords.js');
            dictionaryRef.current = new Set(guessableWordsRes.default);
        }
        try {
            initGame(Array.from(dictionaryRef.current), selectedWager);
            setIsGameActive(true);
            setTimeout(() => {
                // Don't want the deposit dialog to pop up so run set tickets after
                setTickets((prev) => prev! - selectedWager);
            }, 1000);
            customToast({ type: 'success', content: 'Game started!', options: { position: 'top-center', id: 'game-started', duration: 3000 } });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <main>
                <div
                    className={clsx(
                        'mx-auto max-w-lg text-white px-[15px] h-[calc(100vh-85px-45px)] flex flex-col justify-between transition-all duration-300',
                    )}
                >
                    <WordleBoard />
                    <div className='relative'>
                        <Keyboard
                            disabled={!isGameActive || isAwaitingResponse}
                            onClick={onKeyboardClick}
                            onMetaClick={onMetaClick}
                            className={clsx(tickets! > 0 && !isGameActive && 'blur-sm')}
                        />
                        {tickets! > 0 && !isGameActive && (
                            <div className='absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center'>
                                <StartGameButton launchGame={launchGame} />
                            </div>
                        )}
                    </div>
                </div>
            </main>
            {isTicketsDialogOpen ? <TicketsDialog /> : <></>}
        </>
    );
}
