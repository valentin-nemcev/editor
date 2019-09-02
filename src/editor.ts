import * as React from 'react';
import {connect} from 'react-redux';

import {RootState} from './store';
import {setCaret, moveCaret} from './actions';
import {renderToken} from './tokens';
import {buildTokens, CaretPos, Token} from './buildTokens';

import {jsx as e} from '@emotion/core';

const mapStateToProps = (state: RootState) => ({lines: buildTokens(state)});
const dispatchProps = {setCaret, moveCaret};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

const lineHeight = '1.4em';

function selectionToCaretPos(selection: Selection, offset: CaretPos): CaretPos {
    return {
        line: offset.line,
        col: offset.col + selection.anchorOffset,
    };
}

const clickToAction = (setCaret: (p: CaretPos) => unknown) => (
    e: React.MouseEvent,
    t: Token,
): void => {
    setCaret(selectionToCaretPos(window.getSelection() as Selection, t.offset));
};

const keyToAction = (moveCaret: (p: CaretPos) => unknown) => (
    e: React.KeyboardEvent,
): void => {
    e.preventDefault();
    switch (e.key) {
        case 'ArrowUp':
            moveCaret({line: -1, col: 0});
            break;
        case 'ArrowDown':
            moveCaret({line: 1, col: 0});
            break;
        case 'ArrowLeft':
            moveCaret({line: 0, col: -1});
            break;
        case 'ArrowRight':
            moveCaret({line: 0, col: 1});
            break;
    }
    console.log(e.key, e.keyCode, e.charCode);
};

const Editor = ({lines, setCaret, moveCaret}: Props) =>
    e(
        'div',
        {
            tabIndex: 0,
            onKeyDown: keyToAction(moveCaret),
            css: {
                whiteSpace: 'pre',
                fontFamily: 'monospace',
            },
        },
        lines.map((tokens, i) =>
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
                    renderToken(token, e => clickToAction(setCaret)(e, token)),
                ),
            ),
        ),
    );

export default connect(
    mapStateToProps,
    dispatchProps,
)(Editor);
