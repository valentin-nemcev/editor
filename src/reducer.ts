import {createReducer, StateType, ActionType} from 'typesafe-actions';
import {clamp} from 'lodash';

import * as actions from './actions';
import {CaretPos} from './buildTokens';

interface EditorState {
    lines: string[];
    caretPos: CaretPos;
}

const reducer = createReducer<EditorState, ActionType<typeof actions>>()
    .handleAction(actions.setCaretAction, (state, {payload: caretPos}) => ({
        ...state,
        caretPos,
    }))
    .handleAction(
        actions.moveCaretAction,
        ({lines, caretPos}, {payload: delta}) => ({
            lines,
            caretPos: {
                line: clamp(caretPos.line + delta.line, 0, lines.length - 1),
                col: clamp(
                    caretPos.col + delta.col,
                    0,
                    Math.max(caretPos.col, (lines[caretPos.line] || '').length),
                ),
            },
        }),
    );

export type RootState = StateType<ReturnType<typeof reducer>>;
export default reducer;
