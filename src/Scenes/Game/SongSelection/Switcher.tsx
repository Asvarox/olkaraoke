import { focusable } from 'Elements/cssMixins';
import { ReactNode } from 'react';
import styled from 'styled-components';
import styles from '../Singing/GameOverlay/Drawing/styles';
import { SongListEntryDetails } from './SongCard';

interface Props {
    focused: boolean;
    label: ReactNode;
    value: ReactNode;
    onClick?: () => void;
}

export function nextIndex<T>(values: T[], current: number, direction: 1 | -1 = 1): number {
    return direction === 1 ? (current + 1) % values.length : (current + values.length - 1) % values.length;
}
export function nextValueIndex<T>(values: T[], current: T, direction: 1 | -1 = 1): number {
    return nextIndex(values, values.indexOf(current), direction);
}
export function nextValue<T>(values: T[], current: T, direction: 1 | -1 = 1): T {
    return values[nextValueIndex(values, current, direction)];
}

export const Switcher = ({ focused, label, value, onClick, ...restProps }: Props) => (
    <ConfigurationPosition focused={focused} onClick={onClick} {...restProps}>
        <span>{label}:</span> <ConfigValue>{value}</ConfigValue>
    </ConfigurationPosition>
);

const ConfigurationPosition = styled(SongListEntryDetails)<{ focused: boolean }>`
    cursor: pointer;
    padding: 0.25em;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    ${focusable}
`;

const ConfigValue = styled.span`
    color: ${styles.colors.text.active};
    //font-size: 1.1em;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding-left: 10px;
`;
