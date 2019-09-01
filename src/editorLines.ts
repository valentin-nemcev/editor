import * as React from 'react';

import {jsx as e} from '@emotion/core';

import {Token, StringToken, CaretToken, CaretPos} from './buildTokens';

const lineHeight = '1.4em';

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

function renderToken(
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

function selectionToCaretPos(selection: Selection, offset: CaretPos): CaretPos {
    return {
        line: offset.line,
        col: offset.col + selection.anchorOffset,
    };
}

interface EditorProps {
    setCaret: (pos: CaretPos) => void;
    moveCaret: (delta: CaretPos) => void;
    lines: Token[][];
}
export class EditorLines extends React.Component<EditorProps, {}> {
    onTokenClick = (e: React.MouseEvent, t: Token): void =>
        this.props.setCaret(
            selectionToCaretPos(window.getSelection() as Selection, t.offset),
        );

    onKeyDown = (e: React.KeyboardEvent): void => {
        e.preventDefault();
        switch (e.key) {
            case 'ArrowUp':
                return this.props.moveCaret({line: -1, col: 0});
            case 'ArrowDown':
                return this.props.moveCaret({line: 1, col: 0});
            case 'ArrowLeft':
                return this.props.moveCaret({line: 0, col: -1});
            case 'ArrowRight':
                return this.props.moveCaret({line: 0, col: 1});
        }
        console.log(e.key, e.keyCode, e.charCode);
    };

    render(): React.ReactElement {
        return e(
            'div',
            {
                tabIndex: 0,
                onKeyDown: this.onKeyDown,
                css: {
                    whiteSpace: 'pre',
                    fontFamily: 'monospace',
                },
            },
            this.props.lines.map((tokens, i) =>
                e(
                    'div',
                    {
                        key: i,
                        css: {
                            display: 'flex',
                            lineHeight,
                        },
                    },
                    tokens.map(token =>
                        renderToken(token, e => this.onTokenClick(e, token)),
                    ),
                ),
            ),
        );
    }
}
