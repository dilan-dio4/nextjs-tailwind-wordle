import { Button, Tooltip } from 'flowbite-react';
import { TiTicket } from 'react-icons/ti';
import { AiOutlineTrophy } from 'react-icons/ai';
import { MdPersonOutline } from 'react-icons/md';
import React, { useContext } from 'react';
import UiContext from '../../context/UiContext';
import dynamic from 'next/dynamic';
import clsx from 'clsx';

const Stats = dynamic(() => import('./tooltips/Stats'));
const Profile = dynamic(() => import('./tooltips/Profile'));

export default function Nav() {
    const { setIsTicketsDialogOpen, tickets } = useContext(UiContext);

    return (
        <nav>
            <div className='mx-auto max-w-lg px-[15px] text-white flex justify-between my-5 items-center'>
                <div className='flex'>
                    {[
                        {
                            Icon: MdPersonOutline,
                            tooltip: <Profile />,
                        },
                        {
                            Icon: AiOutlineTrophy,
                            tooltip: <Stats />,
                        },
                    ].map(({ Icon, tooltip }, i) => (
                        <React.Fragment key={i}>
                            <div className='ml-2'></div>
                            <Tooltip
                                trigger='click'
                                content={tooltip}
                                placement='bottom'
                                animation='duration-150'
                                className={clsx('tooltip-display-none', 'z-30')}
                            >
                                <Button icon={() => <Icon size={18} className='text-white' />} pill={true} outline={true} size='sm' color='dark' />
                            </Tooltip>
                        </React.Fragment>
                    ))}
                </div>
                <div className='flex'>
                    <Button pill={true} outline={true} size='sm' color='dark' className='ml-2' onClick={(_) => setIsTicketsDialogOpen(true)}>
                        <TiTicket size={18} className='text-white' />
                        <span
                            className={clsx(
                                ('' + tickets).length !== 1 ? 'px-1.5' : 'w-4',
                                'ml-2 inline-flex h-4 items-center justify-center rounded-full bg-blue-200 text-xs font-semibold text-blue-800',
                            )}
                        >
                            {tickets!}
                        </span>
                    </Button>
                </div>
            </div>
            <hr />
        </nav>
    );
}
