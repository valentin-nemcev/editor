import * as React from 'react';
import {jsx} from '@emotion/core';
import {useSelector, useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';

import {setCaretAction, moveCaretAction} from './actions';
import tokens from './tokens';
import {buildTokens, CaretPos, Token as TokenType} from './buildTokens';

const lineHeight = '1.4em';

const clickToAction = (
    setCaret: (p: CaretPos) => unknown,
    t: TokenType,
) => (): void => {
    const selection = window.getSelection();
    if (!selection) return;
    setCaret({
        line: t.offset.line,
        col: t.offset.col + selection.anchorOffset,
    });
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

function assertExaustive(arg: never): never {
    throw new Error('Unexpected exaustive if or switch argument: ' + arg);
}

function getTokenKey({kind, offset}: TokenType): string {
    return offset.line + ':' + offset.col + kind;
}

type Props = {token: TokenType; setCaret: (pos: CaretPos) => void};
const TokenComponent: React.FC<Props> = ({token, setCaret}) => {
    const onClick = clickToAction(setCaret, token);
    switch (token.kind) {
        case 'string':
            return jsx(tokens.StringTokenComponent, {token, onClick});
        case 'caret':
            return jsx(tokens.CaretTokenComponent, {token, onClick});
        default:
            return assertExaustive(token);
    }
};

function Editor() {
    const lines = useSelector(buildTokens);
    const {
        setCaretAction: setCaret,
        moveCaretAction: moveCaret,
    } = bindActionCreators({setCaretAction, moveCaretAction}, useDispatch());
    return (
        <div
            tabIndex={0}
            onKeyDown={keyToAction(moveCaret)}
            css={{whiteSpace: 'pre', fontFamily: 'monospace'}}
        >
            {lines.map((tokens, i) => (
                <div key={i} css={{display: 'flex', lineHeight}}>
                    {tokens.map(token => (
                        <TokenComponent
                            key={getTokenKey(token)}
                            token={token}
                            setCaret={setCaret}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Editor;
