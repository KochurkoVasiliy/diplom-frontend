import React from 'react';

import {router} from '@/app/providers';
import {ThemeProvider, Toaster, ToasterComponent, ToasterProvider} from '@gravity-ui/uikit';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import {createRoot} from 'react-dom/client';
import {RouterProvider} from 'react-router';

const root = document.getElementById('root');

const container = createRoot(root as HTMLElement);
const toaster = new Toaster();

/**
 * Откладывает рендеринг приложения до тех пор, пока DOM не будет готов.
 *
 * @returns {Promise<void>}
 */
// eslint-disable-next-line no-implicit-globals
async function deferRender(): Promise<void> {
    if (process.env.NODE_ENV !== 'development') {
        return;
    }
}

deferRender().then(() => {
    container.render(
        <React.StrictMode>
            <ThemeProvider theme="light">
                <ToasterProvider toaster={toaster}>
                    <RouterProvider router={router} />
                </ToasterProvider>
            </ThemeProvider>
        </React.StrictMode>,
    );
});
