import {Button, Popup} from '@gravity-ui/uikit';
import React from 'react';

export const LeftFloatingBar = () => {
    const ref = React.useRef(null);
    const [open, setOpen] = React.useState(false);

    return (
        <div>
            <Button ref={ref} onClick={() => setOpen((prevOpen) => !prevOpen)}>
                Toggle Popup
            </Button>
            <Popup anchorElement={ref.current} open={open} placement="bottom">
                Content
            </Popup>
        </div>
    );
};
