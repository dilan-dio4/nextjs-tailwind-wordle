import React, { useState, useEffect } from 'react';
import StatsContext from './StatsContext';

interface LocalLifetimeStats {
    lifetimeGamesPlayed: number;
    lifetimeGamesWon: number;
    lifetimeCurrentStreak: number;
    lifetimeMaxStreak: number;
}

export default function StatsProvider({ children }: { children: React.ReactChild | JSX.Element | JSX.Element[] }) {
    const [sessionGamesPlayed, setSessionGamesPlayed] = useState<number>(0);
    const [sessionGamesWon, setSessionGamesWon] = useState<number>(0);
    const [sessionCurrentStreak, setSessionCurrentStreak] = useState<number>(0);
    const [sessionMaxStreak, setSessionMaxStreak] = useState<number>(0);

    const [lifetimeGamesPlayed, setLifetimeGamesPlayed] = useState<number>(0);
    const [lifetimeGamesWon, setLifetimeGamesWon] = useState<number>(0);
    const [lifetimeCurrentStreak, setLifetimeCurrentStreak] = useState<number>(0);
    const [lifetimeMaxStreak, setLifetimeMaxStreak] = useState<number>(0);

    function gameFinishedReducer(status: 'COMPLETE-LOSS' | 'COMPLETE-WIN') {
        const newLocalLifetimeStats: LocalLifetimeStats = {
            lifetimeCurrentStreak,
            lifetimeGamesPlayed,
            lifetimeGamesWon,
            lifetimeMaxStreak,
        };
        setSessionGamesPlayed((prev) => prev + 1);
        setLifetimeGamesPlayed((prev) => prev + 1);
        newLocalLifetimeStats.lifetimeGamesPlayed++;

        if (status === 'COMPLETE-WIN') {
            setSessionGamesWon((prev) => prev + 1);
            setSessionCurrentStreak((prev) => prev + 1);
            if (sessionCurrentStreak + 1 >= sessionMaxStreak) {
                setSessionMaxStreak(sessionCurrentStreak + 1);
            }
            setLifetimeGamesWon((prev) => prev + 1);
            newLocalLifetimeStats.lifetimeGamesWon++;
            setLifetimeCurrentStreak((prev) => prev + 1);
            newLocalLifetimeStats.lifetimeCurrentStreak++;
            if (lifetimeCurrentStreak + 1 >= lifetimeMaxStreak) {
                setLifetimeMaxStreak(lifetimeCurrentStreak + 1);
                newLocalLifetimeStats.lifetimeMaxStreak = lifetimeCurrentStreak + 1;
            }
        } else if (status === 'COMPLETE-LOSS') {
            setSessionCurrentStreak(0);
            setLifetimeCurrentStreak(0);
            newLocalLifetimeStats.lifetimeCurrentStreak = 0;
        }
        window.localStorage.setItem(`wordle-lifetimeStats`, JSON.stringify(newLocalLifetimeStats));
    }

    function initializeStats() {
        setSessionGamesPlayed(0);
        setSessionGamesWon(0);
        setSessionCurrentStreak(0);
        setSessionMaxStreak(0);
        const localLifetimeStats = window.localStorage.getItem(`wordle-lifetimeStats`);
        if (localLifetimeStats) {
            const _localLifetimeStats = JSON.parse(localLifetimeStats);
            setLifetimeGamesPlayed(_localLifetimeStats.lifetimeGamesPlayed);
            setLifetimeGamesWon(_localLifetimeStats.lifetimeGamesWon);
            setLifetimeCurrentStreak(_localLifetimeStats.lifetimeCurrentStreak);
            setLifetimeMaxStreak(_localLifetimeStats.lifetimeMaxStreak);
        }
    }

    useEffect(() => {
        initializeStats();
    }, []);

    return (
        <StatsContext.Provider
            value={{
                gameFinishedReducer,
                sessionGamesPlayed,
                sessionGamesWon,
                sessionCurrentStreak,
                sessionMaxStreak,
                lifetimeGamesPlayed,
                lifetimeGamesWon,
                lifetimeCurrentStreak,
                lifetimeMaxStreak,
            }}
        >
            {children}
        </StatsContext.Provider>
    );
}
