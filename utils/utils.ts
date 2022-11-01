import { WordleGamePiece } from '../context/WordleGameContext';
import customToast from '../components/customToast';

const isDev = process.env.NODE_ENV === 'development';

const flatten = (arr: WordleGamePiece[][]) => arr.reduce((a, b) => a.concat(b));

const roundToLowerEven = (value: number) => {
    const valueInt = Math.floor(value);
    return 2 * Math.round((valueInt % 2 === 0 ? valueInt : valueInt - 1) / 2);
};

const MAX_TICKET_WAGER = 30;
const MIN_TICKET_WAGER = isDev ? 2 : 4;

const copyToClipboard = (value: string, successText: string) => {
    if (!navigator.clipboard) {
        const myInput = document.createElement('input');
        myInput.setAttribute('value', value);
        myInput.setAttribute('hidden', 'true');
        myInput.style.display = 'none';
        myInput.style.visibility = 'hidden';
        document.body.appendChild(myInput);
        myInput.select();
        try {
            document.execCommand('copy');
            customToast({ content: successText, type: 'success' });
        } catch (error) {
            console.error(error);
            customToast({ content: 'Error copying', type: 'error' });
        } finally {
            document.body.removeChild(myInput);
        }
    } else {
        navigator.clipboard.writeText(value).then(
            () => {
                customToast({ content: successText, type: 'success' });
            },
            (error) => {
                console.error(error);
                customToast({ content: 'Error copying', type: 'error' });
            },
        );
    }
};

export { isDev, flatten, MAX_TICKET_WAGER, roundToLowerEven, MIN_TICKET_WAGER, copyToClipboard };
