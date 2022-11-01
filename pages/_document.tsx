import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link rel='preconnect' href='https://fonts.googleapis.com' />
                    <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='true' />
                    <link href='https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap' rel='stylesheet' />
                </Head>
                <body className='dark'>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
