import Tags from '../components/Tags';
import StatsProvider from '../context/StatsProvider';
import UiProvider from '../context/UiProvider';
import WordleGameProvider from '../context/WordleGameProvider';
import { Flowbite } from 'flowbite-react';
import Nav from '../components/Nav';
import MainGame from '../components/MainGame';
import { Toaster } from 'react-hot-toast';

export default function Home() {
    return (
        <UiProvider>
            <StatsProvider>
                <WordleGameProvider>
                    <Tags description='' title='Next.js TailwindCSS Wordle' />
                    <Flowbite>
                        <Nav />
                        <MainGame />
                        <Toaster position='bottom-center' />
                    </Flowbite>
                </WordleGameProvider>
            </StatsProvider>
        </UiProvider>
    );
}
