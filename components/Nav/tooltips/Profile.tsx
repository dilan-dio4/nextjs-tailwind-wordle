import { useContext, useEffect, useState } from 'react';
import { Label, TextInput, Avatar } from 'flowbite-react';
import TextButton from '../../TextButton';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import clsx from 'clsx';
import UiContext from '../../../context/UiContext';

const shuffleArray = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};

export default function Profile() {
    const { setAvatar, avatar, displayName, setDisplayName } = useContext(UiContext);
    const [avatarArr, setAvatarArr] = useState<number[]>([]);
    const [avatarsExpanded, setAvatarsExpanded] = useState<boolean>(false);

    useEffect(() => {
        const nums: number[] = [];
        for (let i = 0; i < 50; i++) {
            nums.push(i);
        }
        setAvatarArr(shuffleArray(nums));
    }, []);

    function onAvatarChange(index: number) {
        setAvatar(index);
    }

    return (
        <>
            <div className='flex flex-col items-start p-4 pb-3'>
                <Label className='mb-2 block' htmlFor='display-name'>
                    Display name
                </Label>
                <TextInput
                    id='display-name'
                    type='text'
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value.substring(0, 20))}
                    onKeyDown={(e) => (e.key === 'Enter' || e.keyCode === 13) && (e.target as HTMLElement).blur()}
                    size={24}
                    className='py-1.5'
                />
                <Label className='mb-2 mt-5 block'>Avatar</Label>
                <Avatar img={avatar !== undefined ? `/avatars/${avatar}.svg` : undefined} rounded bordered size='md' />
            </div>
            {avatarsExpanded ? (
                <>
                    <div className='pl-4 pr-2 py-1 grid grid-cols-4 gap-4 max-h-[200px] h-[200px] overflow-y-auto w-full'>
                        {avatarArr.map((ele) => (
                            <span key={ele} className={clsx('cursor-pointer')} onClick={(_) => onAvatarChange(ele)}>
                                <Avatar img={`/avatars/${ele}.svg`} rounded size='md' bordered={ele === avatar} />
                            </span>
                        ))}
                    </div>
                    <div className='flex justify-center'>
                        <TextButton className='text-center' onClick={(_) => setAvatarsExpanded(false)}>
                            Show less <HiChevronUp size={19} className='mb-[-1px]' />
                        </TextButton>
                    </div>
                </>
            ) : (
                <>
                    <div className='px-4 py-1 grid grid-cols-4 gap-4 w-full'>
                        {avatarArr.slice(0, 4).map((ele) => (
                            <span key={ele} className={clsx('cursor-pointer')} onClick={(_) => onAvatarChange(ele)}>
                                <Avatar img={`/avatars/${ele}.svg`} rounded size='md' bordered={ele === avatar} />
                            </span>
                        ))}
                    </div>
                    <div className='flex justify-center'>
                        <TextButton className='text-center' onClick={(_) => setAvatarsExpanded(true)}>
                            Show more <HiChevronDown size={19} className='mb-[-1px]' />
                        </TextButton>
                    </div>
                </>
            )}
        </>
    );
}
