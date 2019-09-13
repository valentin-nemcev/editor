import {createReducer, StateType, ActionType} from 'typesafe-actions';
import assert from 'power-assert';
import {clamp} from 'lodash';

import * as actions from './actions';
import {CaretPos} from './buildTokens';

export type RootAction = ActionType<typeof actions>;

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
    {line, col}: CaretPos,
    lines: Lines,
): CaretPos {
    function moveCaretColOrLine(delta: CaretPos): CaretPos {
        const colPastEnd = delta.col === 0;
        const {line, col} = clampCaretPos(caretPos, lines, {colPastEnd});
        return clampCaretPos(
            {line: line + delta.line, col: col + delta.col},
            lines,
            {colPastEnd},
        );
    }
    if (line !== 0) caretPos = moveCaretColOrLine({line, col: 0});
    if (col !== 0) caretPos = moveCaretColOrLine({line: 0, col});
    return caretPos;
}

const actionReducer = createReducer<EditorState, RootAction>({
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
    )
    .handleAction(
        actions.insertCharAction,
        ({lines, caretPos: {line, col}}, {payload: char}) => ({
            lines: [
                ...lines.slice(0, line),
                lines[line].slice(0, col) + char + lines[line].slice(col),
                ...lines.slice(line + 1),
            ],
            caretPos: {line, col},
        }),
    );

const assertStateInvariants = (state: EditorState): void => {
    const {caretPos} = state;
    try {
        assert(caretPos.line >= 0);
        assert(caretPos.col >= 0);
    } catch (e) {
        if (process.env.NODE_ENV !== 'test')
            throw new Error('Assertion failed \n' + e.message);
        else throw e;
    }
};

const reducer: typeof actionReducer = (state, action) => {
    state = actionReducer(state, action);
    assertStateInvariants(state);
    return state;
};
reducer.handlers = actionReducer.handlers;

export type RootState = StateType<ReturnType<typeof reducer>>;
export default reducer;
