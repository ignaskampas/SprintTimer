import React from 'react';
import styles from './footer.module';
import {FaLinkedin} from 'react-icons/fa'
import {FaGithubSquare} from 'react-icons/fa'

function Footer() {

    return (
        <div className={styles.footer}>
            <div className={styles.icons}>
                <a className={styles.iconLink} href="https://uk.linkedin.com/in/ignas-kampas-8469a3ba">
                        <FaLinkedin className={styles.icon}/>
                </a>
                <a className={styles.iconLink} href="https://github.com/ignaskampas">
                    <FaGithubSquare className={styles.icon}/>
                </a>
            </div>
            <div className={styles.textContainer}>
                Designed & Developed by Ignas Kampas
            </div>

        </div>
    )
}

export default Footer;