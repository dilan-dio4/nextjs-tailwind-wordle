import { useContext } from 'react';
import WordleGameContext from '../../context/WordleGameContext';
import LetterBlock from './LetterBlock';
import { TiTicket } from 'react-icons/ti';
import clsx from 'clsx';
import useDeviceSize from '../../utils/useDeviceSize';
import UiContext from '../../context/UiContext';
import { flatten } from '../../utils/utils';
import styles from '../../styles/components/WordleBoard.module.css';

export default function WordleBoard() {
    const { wordleGameState } = useContext(WordleGameContext);
    const { selectedWager } = useContext(UiContext);
    const { width } = useDeviceSize();
    // 295 vs 361
    return (
        <div className={clsx(styles['board-grid'], 'grid grid-cols-5 mx-auto mt-5 md:mt-16 relative overflow-visible')}>
            {flatten(wordleGameState).map((ele) => (
                <LetterBlock key={ele.id} {...ele} />
            ))}
            {!!selectedWager && (
                <>
                    {width < 992 ? (
                        <>
                            <div className={clsx(styles['ticket-root'], 'left-[-45px] bottom-[calc(100%-50px)]')}>{selectedWager * 6}</div>
                            <div className={clsx(styles['ticket-root'], 'left-[-45px] bottom-[calc(83.3334%-51px)]')}>{selectedWager * 4}</div>
                            <div className={clsx(styles['ticket-root'], 'left-[-45px] bottom-[calc(66.6667%-51px)]')}>{selectedWager * 2.5}</div>
                            <div className={clsx(styles['ticket-root'], 'left-[-45px] bottom-[calc(50%-52px)]')}>{selectedWager}</div>
                            <div className={clsx(styles['ticket-root'], 'left-[-45px] bottom-[calc(33.3334%-52px)]')}>{selectedWager}</div>
                            <div className={clsx(styles['ticket-root'], 'left-[-45px] bottom-[calc(16.6667%-53px)]')}>{selectedWager / 2}</div>

                            <div className={clsx(styles['ticket-root'], 'right-[-44px] bottom-[calc(100%-50px)]')}>
                                <TiTicket className='ml-2' size={18} />
                            </div>
                            <div className={clsx(styles['ticket-root'], 'right-[-44px] bottom-[calc(83.3334%-51px)]')}>
                                <TiTicket className='ml-2' size={18} />
                            </div>
                            <div className={clsx(styles['ticket-root'], 'right-[-44px] bottom-[calc(66.6667%-51px)]')}>
                                <TiTicket className='ml-2' size={18} />
                            </div>
                            <div className={clsx(styles['ticket-root'], 'right-[-44px] bottom-[calc(50%-52px)]')}>
                                <TiTicket className='ml-2' size={18} />
                            </div>
                            <div className={clsx(styles['ticket-root'], 'right-[-44px] bottom-[calc(33.3334%-52px)]')}>
                                <TiTicket className='ml-2' size={18} />
                            </div>
                            <div className={clsx(styles['ticket-root'], 'right-[-44px] bottom-[calc(16.6667%-53px)]')}>
                                <TiTicket className='ml-2' size={18} />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={clsx(styles['ticket-root'], 'right-[-63px] bottom-[calc(100%-58px)]')}>
                                {selectedWager * 6} <TiTicket className='ml-1' size={18} />
                            </div>
                            <div className={clsx(styles['ticket-root'], 'right-[-63px] bottom-[calc(83.3334%-59px)]')}>
                                {selectedWager * 4} <TiTicket className='ml-1' size={18} />
                            </div>
                            <div className={clsx(styles['ticket-root'], 'right-[-63px] bottom-[calc(66.6667%-59px)]')}>
                                {selectedWager * 2.5} <TiTicket className='ml-1' size={18} />
                            </div>
                            <div className={clsx(styles['ticket-root'], 'right-[-63px] bottom-[calc(50%-59px)]')}>
                                {selectedWager} <TiTicket className='ml-1' size={18} />
                            </div>
                            <div className={clsx(styles['ticket-root'], 'right-[-63px] bottom-[calc(33.3334%-60px)]')}>
                                {selectedWager} <TiTicket className='ml-1' size={18} />
                            </div>
                            <div className={clsx(styles['ticket-root'], 'right-[-63px] bottom-[calc(16.6667%-60px)]')}>
                                {selectedWager / 2} <TiTicket className='ml-1' size={18} />
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
