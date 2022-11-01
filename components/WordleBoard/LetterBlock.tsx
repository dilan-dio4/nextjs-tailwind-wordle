import styles from '../../styles/components/WordleBoard.module.css';
import { WordleGamePiece } from '../../context/WordleGameContext';
import clsx from 'clsx';

export default function LetterBlock({ status, letter, opponentStatus }: WordleGamePiece) {
    return (
        <div className={clsx(styles['root'], styles[status])}>
            {letter || ''}
            {opponentStatus && <div className={clsx('absolute bottom-1 right-1 h-2 w-2 border-solid border-2 rounded', styles[opponentStatus])}></div>}
        </div>
    );
}
