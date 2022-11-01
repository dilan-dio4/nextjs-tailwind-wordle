import React, { useEffect, useRef, useState } from 'react';
import { MAX_TICKET_WAGER, roundToLowerEven } from '../utils/utils';
import UiContext from './UiContext';

export default function UiProvider({ children }: { children: React.ReactChild | JSX.Element | JSX.Element[] }) {
    const [selectedWager, setSelectedWager] = useState<number>(0);
    const [isGameActive, setIsGameActive] = useState<boolean>(false);
    const [isAwaitingResponse, setIsAwaitingResponse] = useState<boolean>(false);
    const [displayName, setDisplayName] = useState<string>('');
    const [avatar, setAvatar] = useState<number>();
    const [tickets, setTickets] = useState<number>();
    const [isTicketsDialogOpen, setIsTicketsDialogOpen] = useState<boolean>(false);

    const didFirstRunRef = useRef<boolean>(false);

    useEffect(() => {
        const localTickets = window.localStorage.getItem(`wordle-tickets`);
        if (localTickets) {
            const _localTicketsNum = +localTickets;
            setSelectedWager(Math.min(roundToLowerEven(_localTicketsNum / 2), MAX_TICKET_WAGER));
            setTickets(_localTicketsNum);
        } else {
            // Always give 10
            setTickets(10);
        }
    }, []);

    useEffect(() => {
        if (didFirstRunRef.current === false) {
            didFirstRunRef.current = true;
            return;
        }

        window.localStorage.setItem(`wordle-tickets`, '' + tickets);

        if (tickets === 0) {
            if (!isGameActive) {
                setIsTicketsDialogOpen(true);
            }
        }
    }, [tickets]);

    return (
        <UiContext.Provider
            value={{
                tickets,
                setTickets,
                selectedWager,
                setSelectedWager,
                isTicketsDialogOpen,
                setIsTicketsDialogOpen,
                isGameActive,
                setIsGameActive,
                isAwaitingResponse,
                setIsAwaitingResponse,
                displayName,
                setDisplayName,
                avatar,
                setAvatar,
            }}
        >
            {tickets !== undefined ? children : <></>}
        </UiContext.Provider>
    );
}
