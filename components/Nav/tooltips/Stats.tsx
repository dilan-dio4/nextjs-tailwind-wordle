import { useContext } from 'react';
import StatsContext from '../../../context/StatsContext';

export default function Stats() {
    const {
        sessionGamesPlayed,
        sessionMaxStreak,
        sessionGamesWon,
        sessionCurrentStreak,
        lifetimeCurrentStreak,
        lifetimeGamesPlayed,
        lifetimeMaxStreak,
        lifetimeGamesWon,
    } = useContext(StatsContext);

    return (
        <div className='flex flex-col items-center p-4'>
            <h2 className='text-md tracking-tight'>Statistics</h2>
            <h3 className='mt-4 mb-1 text-sm tracking-tight font-thin'>Current session</h3>
            <div className='flex justify-center items-start'>
                {[
                    {
                        number: sessionGamesPlayed,
                        title: (
                            <>
                                Games
                                <br />
                                played
                            </>
                        ),
                    },
                    {
                        number: sessionGamesWon === 0 ? '0%' : `${Math.round((sessionGamesWon / sessionGamesPlayed) * 100)}%`,
                        title: <>Win %</>,
                    },
                    {
                        number: sessionCurrentStreak,
                        title: (
                            <>
                                Current
                                <br />
                                streak
                            </>
                        ),
                    },
                    {
                        number: sessionMaxStreak,
                        title: (
                            <>
                                Max
                                <br />
                                streak
                            </>
                        ),
                    },
                ].map((ele, i) => (
                    <div key={i} className='flex flex-col items-center mx-2.5'>
                        <h5 className='text-xl tracking-tight'>{ele.number}</h5>
                        <h3 className='text-center text-xs tracking-tight font-thin leading-none'>{ele.title}</h3>
                    </div>
                ))}
            </div>
            <h3 className='mt-8 mb-1 text-sm tracking-tight font-thin'>Lifetime</h3>
            <div className='flex justify-center items-start mb-4'>
                {[
                    {
                        number: lifetimeGamesPlayed,
                        title: (
                            <>
                                Games
                                <br />
                                played
                            </>
                        ),
                    },
                    {
                        number: lifetimeGamesPlayed === 0 ? '0%' : `${Math.round((lifetimeGamesWon / lifetimeGamesPlayed) * 100)}%`,
                        title: <>Win %</>,
                    },
                    {
                        number: lifetimeCurrentStreak,
                        title: (
                            <>
                                Current
                                <br />
                                streak
                            </>
                        ),
                    },
                    {
                        number: lifetimeMaxStreak,
                        title: (
                            <>
                                Max
                                <br />
                                streak
                            </>
                        ),
                    },
                ].map((ele, i) => (
                    <div key={i} className='flex flex-col items-center mx-2.5'>
                        <h5 className='text-xl tracking-tight'>{ele.number}</h5>
                        <h3 className='text-center text-xs tracking-tight font-thin leading-none'>{ele.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}
