/** @jsx jsx */
import {jsx, css} from '@emotion/core';
import {useEffect, useRef} from 'react';

import {StringToken, CaretToken} from './buildTokens';

const stringStyles = css({
    display: 'inline-block',
    flex: 0,
    '&:last-child': {
        marginRight: 'auto',
        flex: 1,
    },
});

const zeroWidthSpace = '\u200B';
const StringTokenComponent: React.FC<
    {token: StringToken} & React.HTMLAttributes<HTMLElement>
> = ({token: {text}, ...props}) => (
    <span {...props} css={stringStyles}>
        {text || '\n'}
    </span>
);

const caretStyles = css({
    display: 'inline-block',
    userSelect: 'none',
    borderLeft: '1px solid black',
    marginLeft: '-1px',
    color: 'gray',
});

function toggleVisibility(style: CSSStyleDeclaration, toggle?: boolean): void {
    if (toggle == null) toggle = style.visibility === 'hidden';
    if (toggle) style.visibility = '';
    else style.visibility = 'hidden';
}

const CaretTokenComponent: React.FC<
    {token: CaretToken} & React.HTMLAttributes<HTMLElement>
> = ({token: _, ...props}) => {
    // Blink
    const ref = useRef<HTMLElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        toggleVisibility(el.style, true);
        const intevalId = setInterval(() => toggleVisibility(el.style), 500);
        return () => clearInterval(intevalId);
    });

    return (
        <span {...props} ref={ref} css={caretStyles}>
            {zeroWidthSpace}
        </span>
    );
};

const tokens = {StringTokenComponent, CaretTokenComponent};
export default tokens;
