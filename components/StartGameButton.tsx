import { Button, Dropdown } from 'flowbite-react';
import React, { useContext, useState } from 'react';
import { TiTicket } from 'react-icons/ti';
import UiContext from '../context/UiContext';
import { HiChevronDown } from 'react-icons/hi';
import styles from '../styles/components/StartGameButton.module.css';
import clsx from 'clsx';
import { isDev, MAX_TICKET_WAGER, MIN_TICKET_WAGER, roundToLowerEven } from '../utils/utils';
import customToast from './customToast';

export default function StartGameButton({ launchGame }: { launchGame(): Promise<void> }) {
    const { selectedWager, setSelectedWager, tickets } = useContext(UiContext);

    const [isHoveringDropdown, setIsHoveringDropdown] = useState<boolean>(false);
    const [isLaunchingGame, setIsLaunchingGame] = useState<boolean>(false);

    function handleDropdownRootClick(e: React.MouseEvent | React.TouchEvent) {
        e.stopPropagation();
        e.preventDefault();
        document.getElementById('hidden-flowbite-dropdown')?.querySelector('button')?.click();
    }

    function handleDropdownItemClick(val: number) {
        setSelectedWager(val);
        document.getElementById('hidden-flowbite-dropdown')?.querySelector('button')?.click();
    }

    function onStartClick() {
        if (isLaunchingGame) {
            return;
        } else if (selectedWager < MIN_TICKET_WAGER) {
            customToast({ type: 'error', content: `Must wager at least ${MIN_TICKET_WAGER} tickets`, options: { id: 'wager-min-toast' } });
        } else if (selectedWager > MAX_TICKET_WAGER) {
            customToast({ type: 'error', content: `Must wager less than ${MAX_TICKET_WAGER} tickets`, options: { id: 'wager-max-toast' } });
        } else {
            setIsLaunchingGame(true);
            launchGame();
        }
    }

    const numOfOptions = Math.min(roundToLowerEven(tickets!), MAX_TICKET_WAGER);
    const ticketIndexes = [...new Array(Math.round(numOfOptions / 2))].map((_, i) => numOfOptions - i * 2);
    if (!isDev) {
        ticketIndexes.pop(); // Remove 2
    }

    return (
        <div className='relative'>
            <Button
                gradientDuoTone='purpleToPink'
                size='xl'
                pill
                className={clsx(styles['button-root'], '!z-20 relative', isHoveringDropdown && styles['force-hover'], isLaunchingGame && 'pointer-events-none')}
                outline
                onClick={onStartClick}
            >
                {isLaunchingGame ? (
                    <span className='w-[227px]'>Loading...</span>
                ) : (
                    <>
                        Start game for
                        <div
                            className={clsx(
                                styles['dropdown-root'],
                                'flex items-center justify-center top-0 bottom-0 w-[65px] absolute right-[60px] hover:text-gray-400',
                            )}
                            onPointerDown={handleDropdownRootClick}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                            }}
                            onMouseOver={(e) => setIsHoveringDropdown(true)}
                            onMouseOut={(e) => setIsHoveringDropdown(false)}
                        >
                            <b>{selectedWager}</b>
                            <HiChevronDown className='ml-0.5 -mr-1' size={19} />
                        </div>
                        <TiTicket size={20} className='ml-[95px] text-white' />
                    </>
                )}
            </Button>
            {!isLaunchingGame && ticketIndexes.length !== 0 && (
                <div className={clsx(styles['dropdown-width'], 'absolute z-10 mb-5 text-center left-[183px] w-0 top-0')} id='hidden-flowbite-dropdown'>
                    <Dropdown className='!w-[65px] pl-2 max-h-[70vh] overflow-y-auto overflow-x-hidden' label={'' + selectedWager} placement='top'>
                        {ticketIndexes.map((ele) => (
                            <Dropdown.Item key={ele} onClick={() => handleDropdownItemClick(ele)}>
                                <b>{ele}</b>
                            </Dropdown.Item>
                        ))}
                    </Dropdown>
                </div>
            )}
        </div>
    );
}
