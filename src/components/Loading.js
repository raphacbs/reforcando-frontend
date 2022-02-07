import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';


const Loading = (props) => {



    return (
        <Dialog visible={props.visible}
            closeOnEscape={false}
            showHeader={false}
            closable={false}>
            <ProgressSpinner />
        </Dialog>
    );

}

export default Loading;
