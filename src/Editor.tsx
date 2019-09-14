import * as React from 'react';
import {jsx} from '@emotion/core';
import {useSelector, useDispatch} from 'react-redux';
import {Dispatch} from 'redux';

import tokens from './tokens';
import {buildTokens, Token as TokenType} from './buildTokens';
import {setCaretAction} from './actions';
import keymap, {eventToKey} from './keymap';

const lineHeight = '1.4em';

const clickToAction = (dispatch: Dispatch, t: TokenType) => (): void => {
    const selection = window.getSelection();
    if (!selection) return;
    dispatch(
        setCaretAction({
            line: t.offset.line,
            col: t.offset.col + selection.anchorOffset,
        }),
    );
};

const keyToAction = (dispatch: Dispatch) => (e: React.KeyboardEvent): void => {
    e.preventDefault();
    const native = e.nativeEvent;
    keymap(native, dispatch);
};

function assertExaustive(arg: never): never {
    throw new Error('Unexpected exaustive if or switch argument: ' + arg);
}

function getTokenKey({kind, offset}: TokenType): string {
    return offset.line + ':' + offset.col + kind;
}

type Props = {token: TokenType};
const TokenComponent: React.FC<Props> = ({token}) => {
    const onClick = clickToAction(useDispatch(), token);
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
    const dispatch = useDispatch();

    return (
        <div
            tabIndex={0}
            onKeyDown={keyToAction(dispatch)}
            css={{whiteSpace: 'pre', fontFamily: 'monospace'}}
        >
            {lines.map((tokens, i) => (
                <div key={i} css={{display: 'flex', lineHeight}}>
                    {tokens.map(token => (
                        <TokenComponent
                            key={getTokenKey(token)}
                            token={token}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Editor;
