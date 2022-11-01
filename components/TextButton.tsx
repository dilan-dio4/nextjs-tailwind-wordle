import clsx from 'clsx';
import { Button, ButtonComponentProps } from 'flowbite-react';

export default function TextButton(props: ButtonComponentProps) {
    return (
        <Button
            {...props}
            className={clsx('!bg-transparent !outline-none transition-colors hover:text-gray-400', props.className)}
            style={{
                boxShadow: 'none',
                margin: 0,
            }}
        />
    );
}
