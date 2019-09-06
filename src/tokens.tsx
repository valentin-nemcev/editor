/** @jsx jsx */
import {jsx} from '@emotion/core';

import {StringToken, CaretToken} from './buildTokens';

const zeroWidthSpace = '\u200B';
const StringTokenComponent: React.FC<
    {token: StringToken} & React.HTMLAttributes<HTMLElement>
> = ({token: {text}, ...props}) => (
    <span
        {...props}
        css={{
            display: 'inline-block',
            flex: 0,
            '&:last-child': {
                marginRight: 'auto',
                flex: 1,
            },
        }}
    >
        {text || '\n'}
    </span>
);

const CaretTokenComponent: React.FC<
    {token: CaretToken} & React.HTMLAttributes<HTMLElement>
> = ({token: _, ...props}) => (
    <span
        {...props}
        css={{
            display: 'inline-block',
            userSelect: 'none',
            borderLeft: '1px solid black',
            marginLeft: '-1px',
            color: 'gray',
        }}
    >
        {zeroWidthSpace}
    </span>
);

const tokens = {StringTokenComponent, CaretTokenComponent};
export default tokens;
