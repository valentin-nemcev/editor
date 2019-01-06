import * as React from 'react'

import {css} from 'emotion'
import {Token, StringToken, CaretToken, CaretPos} from './buildTokens'

const e = React.createElement

const lineHeight = '1.4em'

function assertExaustive(arg: never): never {
    throw new Error('Unexpected exaustive if or switch argument: ' + arg)
}

function caretPosToKey(p: CaretPos): string {
    return p.line + ':' + p.col
}

const zeroWidthSpace = '\u200B'
const render = {
    string(t: StringToken, props?: React.HTMLProps<any>): React.ReactNode {
        return e(
            'span',
            {
                ...props,
                className: css({
                    display: 'inline-block',
                    flex: 0,
                    '&:last-child': {
                        marginRight: 'auto',
                        flex: 1,
                    },
                }),
            },
            t.text || '\n',
        )
    },

    caret(t: CaretToken, props?: React.HTMLProps<any>): React.ReactNode {
        return e(
            'span',
            {
                ...props,
                className: css({
                    display: 'inline-block',
                    userSelect: 'none',
                    borderLeft: '1px solid black',
                    marginLeft: '-1px',
                    color: 'gray',
                }),
            },
            zeroWidthSpace,
        )
    },
}

function renderToken(
    t: Token,
    onClick: React.MouseEventHandler,
): React.ReactNode {
    const key = caretPosToKey(t.offset) + t.kind
    switch (t.kind) {
        case 'string':
            return render.string(t, {key, onClick})
        case 'caret':
            return render.caret(t, {key, onClick})
        default:
            assertExaustive(t)
    }
}

function selectionToCaretPos(selection: Selection, offset: CaretPos) {
    return {
        line: offset.line,
        col: offset.col + selection.anchorOffset,
    }
}

interface EditorProps {
    setCaret: (pos: CaretPos) => void
    lines: Token[][]
}
export class EditorLines extends React.Component<EditorProps, {}> {
    onTokenClick = (e: React.MouseEvent, t: Token) =>
        this.props.setCaret(
            selectionToCaretPos(window.getSelection(), t.offset),
        )
    render() {
        return e(
            'div',
            {
                className: css({
                    whiteSpace: 'pre',
                    fontFamily: 'monospace',
                }),
            },
            this.props.lines.map((tokens, i) =>
                e(
                    'div',
                    {
                        key: i,
                        className: css({
                            display: 'flex',
                            lineHeight,
                        }),
                    },
                    tokens.map(token =>
                        renderToken(token, e => this.onTokenClick(e, token)),
                    ),
                ),
            ),
        )
    }
}
