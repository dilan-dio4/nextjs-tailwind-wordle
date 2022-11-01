import { createContext } from 'react';

interface IUiContext {
    tickets: number | undefined;
    setTickets: React.Dispatch<React.SetStateAction<number | undefined>>;
    selectedWager: number;
    setSelectedWager: React.Dispatch<React.SetStateAction<number>>;
    isGameActive: boolean;
    setIsGameActive: React.Dispatch<React.SetStateAction<boolean>>;
    isAwaitingResponse: boolean;
    setIsAwaitingResponse: React.Dispatch<React.SetStateAction<boolean>>;
    displayName: string;
    setDisplayName: React.Dispatch<React.SetStateAction<string>>;
    avatar: number | undefined;
    setAvatar: React.Dispatch<React.SetStateAction<number | undefined>>;
    isTicketsDialogOpen: boolean;
    setIsTicketsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UiContext = createContext<IUiContext>({} as IUiContext);

export default UiContext;
