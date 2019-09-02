import {createReducer, StateType, ActionType} from 'typesafe-actions';
import {clamp} from 'lodash';

import * as actions from './actions';
import {CaretPos} from './buildTokens';

interface EditorState {
    lines: string[];
    caretPos: CaretPos;
}

const createRootReducer = (initialText: string) =>
    createReducer<EditorState, ActionType<typeof actions>>({
        lines: initialText.split('\n'),
        caretPos: {line: 3, col: 5},
    })
        .handleAction(actions.setCaret, (state, {payload: caretPos}) => ({
            ...state,
            caretPos,
        }))
        .handleAction(
            actions.moveCaret,
            ({lines, caretPos}, {payload: delta}) => ({
                lines,
                caretPos: {
                    line: clamp(
                        caretPos.line + delta.line,
                        0,
                        lines.length - 1,
                    ),
                    col: clamp(
                        caretPos.col + delta.col,
                        0,
                        Math.max(
                            caretPos.col,
                            (lines[caretPos.line] || '').length,
                        ),
                    ),
                },
            }),
        );

export type RootState = StateType<ReturnType<typeof createRootReducer>>;
export {createRootReducer};
