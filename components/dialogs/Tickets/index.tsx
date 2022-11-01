import { Button, Modal } from 'flowbite-react';
import React, { useContext } from 'react';
import clsx from 'clsx';
import UiContext from '../../../context/UiContext';
import { TiTicket } from 'react-icons/ti';

export default function Index() {
    const { setIsTicketsDialogOpen, setTickets, tickets } = useContext(UiContext);

    function onAddTicketsClick() {
        setTickets((prev) => prev! + 10);
        setIsTicketsDialogOpen(false);
    }

    return (
        <Modal show size='md' onClose={() => setIsTicketsDialogOpen(false)}>
            {tickets! > 0 && (
                <button
                    onClick={(_) => setIsTicketsDialogOpen(false)}
                    className='absolute right-3 top-3 inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white'
                    type='button'
                >
                    <svg
                        stroke='currentColor'
                        fill='none'
                        strokeWidth='0'
                        viewBox='0 0 24 24'
                        className='h-5 w-5'
                        height='1em'
                        width='1em'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'></path>
                    </svg>
                </button>
            )}
            <Modal.Body className={clsx('space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8')}>
                <h3 className='text-xl font-medium text-white'>
                    You currently have <b>{tickets}</b> ticket{tickets === 1 ? '' : 's'}
                </h3>

                <Button outline gradientDuoTone='purpleToBlue' size='md' onClick={onAddTicketsClick}>
                    <span className='pr-[8px]'>Add 10 Tickets</span>
                    <TiTicket size={18} className='text-white' />
                </Button>
            </Modal.Body>
        </Modal>
    );
}
