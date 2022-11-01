import { createContext } from 'react';

interface IStatsContext {
    gameFinishedReducer(status: 'COMPLETE-LOSS' | 'COMPLETE-WIN'): void;

    sessionGamesPlayed: number;
    sessionGamesWon: number;
    sessionCurrentStreak: number;
    sessionMaxStreak: number;

    lifetimeGamesPlayed: number;
    lifetimeGamesWon: number;
    lifetimeCurrentStreak: number;
    lifetimeMaxStreak: number;
}

const StatsContext = createContext<IStatsContext>({} as IStatsContext);

export default StatsContext;
