import Head from 'next/head';

interface ITags {
    description: string;
    title: string;
}

export default function Tags({ title, description }: ITags) {
    const truncatedDescription = description.substring(0, 155);

    return (
        <Head>
            <title>{title}</title>
            <meta name='description' content={truncatedDescription} />
            <meta name='color-scheme' content='dark light' />

            <meta name='theme-color' content='#1d222e' />
            <meta name='application-name' content={title} />
        </Head>
    );
}
