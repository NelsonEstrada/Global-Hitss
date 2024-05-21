/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
/* eslint-disable no-new */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import styles from './Header.module.scss';

function Header(props: { title: string; }){

    const styleHeader = styles.title + ' ms-Grid-col ms-md12';
    const styleLogo = styles.logo + ' ms-Grid-col ms-md1';
    const styleName = styles.label + ' ms-Grid-col ms-md11';
    
    return (
        <div className={styleHeader}>
            <div className={styleLogo}>
                <img alt="Claro" className={styles.imgClaro} src={require('../../assets/logo-claro-blanco.svg')} />
            </div>
            <div className={styleName}>
                {props.title}
            </div>
        </div>
    );
    
}

export default Header;