import { IoIosBackspace } from 'react-icons/io';
import styles from '../styles/components/Keyboard.module.css';
import clsx from 'clsx';
import { useContext } from 'react';
import WordleGameContext from '../context/WordleGameContext';

interface IKeyboard {
    onClick(letter: string): any;
    onMetaClick(key: 'Backspace' | 'Enter'): any;
    disabled?: boolean;
    className?: string;
}

export default function Keyboard({ onClick, onMetaClick, disabled, className }: IKeyboard) {
    const { keyStatusMap } = useContext(WordleGameContext);
    const rows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        [<IoIosBackspace size={23} className='mx-2' key='Backspace' />, 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Enter'],
    ];

    function clickHandler(key: string | JSX.Element) {
        if (typeof key !== 'string') {
            onMetaClick('Backspace');
        } else if (key === 'Enter') {
            onMetaClick('Enter');
        } else {
            onClick(key);
        }
    }

    return (
        <div className={clsx('flex flex-col', className)}>
            {rows.map((row, i) => (
                <div className='flex justify-center mt-1' key={i}>
                    {row.map((key, i2) => (
                        <div
                            onClick={() => !disabled && clickHandler(key)}
                            key={i2}
                            tabIndex={-1}
                            className={clsx(
                                styles['root-key'],
                                disabled ? styles['disabled-key'] : styles['key'],
                                key === 'Enter' && styles['meta-key'],
                                typeof key === 'object' && styles['meta-key'],
                                // @ts-ignore
                                typeof key === 'string' && keyStatusMap[key] && styles['KEY-STATUS-' + keyStatusMap[key]],
                            )}
                        >
                            {key}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
