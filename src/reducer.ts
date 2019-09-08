import {createReducer, StateType, ActionType} from 'typesafe-actions';
import {clamp} from 'lodash';

import * as actions from './actions';
import {CaretPos} from './buildTokens';

type Lines = string[];
interface EditorState {
    lines: Lines;
    caretPos: CaretPos;
}

function clampCaretPos(
    caretPos: CaretPos,
    lines: Lines,
    {
        linePastEnd = false,
        colPastEnd = false,
    }: {linePastEnd?: boolean; colPastEnd?: boolean} = {},
): CaretPos {
    const line = clamp(
        caretPos.line,
        0,
        linePastEnd ? Number.MAX_SAFE_INTEGER : lines.length,
    );
    const col = clamp(
        caretPos.col,
        0,
        colPastEnd ? Number.MAX_SAFE_INTEGER : (lines[line] || []).length,
    );
    return {line, col};
}

const setCaretPos = clampCaretPos;

function moveCaretPos(
    caretPos: CaretPos,
    delta: CaretPos,
    lines: Lines,
): CaretPos {
    const colPastEnd = delta.col === 0;
    const {line, col} = clampCaretPos(caretPos, lines, {colPastEnd});
    return clampCaretPos(
        {line: line + delta.line, col: col + delta.col},
        lines,
        {colPastEnd},
    );
}

const reducer = createReducer<EditorState, ActionType<typeof actions>>({
    lines: [],
    caretPos: {line: 0, col: 0},
})
    .handleAction(actions.setCaretAction, ({lines}, {payload: caretPos}) => ({
        lines,
        caretPos: setCaretPos(caretPos, lines),
    }))
    .handleAction(
        actions.moveCaretAction,
        ({lines, caretPos}, {payload: delta}) => ({
            lines,
            caretPos: moveCaretPos(caretPos, delta, lines),
        }),
    );

export type RootState = StateType<ReturnType<typeof reducer>>;
export default reducer;
