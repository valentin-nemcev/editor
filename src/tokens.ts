import * as React from 'react';

import {jsx as e} from '@emotion/core';

import {Token, StringToken, CaretToken, CaretPos} from './buildTokens';

function assertExaustive(arg: never): never {
    throw new Error('Unexpected exaustive if or switch argument: ' + arg);
}

function caretPosToKey(p: CaretPos): string {
    return p.line + ':' + p.col;
}

const zeroWidthSpace = '\u200B';
const render = {
    string(t: StringToken, props?: React.HTMLProps<unknown>): React.ReactNode {
        return e(
            'span',
            {
                ...props,
                css: {
                    display: 'inline-block',
                    flex: 0,
                    '&:last-child': {
                        marginRight: 'auto',
                        flex: 1,
                    },
                },
            },
            t.text || '\n',
        );
    },

    caret(t: CaretToken, props?: React.HTMLProps<unknown>): React.ReactNode {
        return e(
            'span',
            {
                ...props,
                css: {
                    display: 'inline-block',
                    userSelect: 'none',
                    borderLeft: '1px solid black',
                    marginLeft: '-1px',
                    color: 'gray',
                },
            },
            zeroWidthSpace,
        );
    },
};

export function renderToken(
    t: Token,
    onClick: React.MouseEventHandler,
): React.ReactNode {
    const key = caretPosToKey(t.offset) + t.kind;
    switch (t.kind) {
        case 'string':
            return render.string(t, {key, onClick});
        case 'caret':
            return render.caret(t, {key, onClick});
        default:
            assertExaustive(t);
    }
}
