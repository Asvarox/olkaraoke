import { typography } from 'Elements/cssMixins';
import styled, { css } from 'styled-components';
import styles from '../Scenes/Game/Singing/GameOverlay/Drawing/styles';

export const Button = styled.button<{ focused?: boolean }>`
    padding: 0.15em 0.3em;
    font-size: 1em;
    display: block;
    text-align: center;
    cursor: pointer;
    border: 0;

    background-color: rgba(0, 0, 0, 0.75);
    text-transform: uppercase;
    letter-spacing: 2px;

    ${typography}

    pointer-events: auto;
    ${(props) => props.focused && buttonFocused}

    transition: 300ms;
`;

export const buttonFocused = css`
    transform: scale(1.05);
    background: ${styles.colors.text.active};

    @keyframes button-focus-loop {
        0%,
        100% {
            transform: scale(1.045);
        }
        50% {
            transform: scale(1.055);
        }
    }
    animation: button-focus-loop 600ms ease-in-out infinite both;
`;
