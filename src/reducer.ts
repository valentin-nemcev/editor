import {createReducer, StateType, ActionType, Reducer} from 'typesafe-actions';
import assert from 'power-assert';
import {clamp} from 'lodash';

import * as actions from './actions';
import {CaretPos} from './buildTokens';

type RootAction = ActionType<typeof actions>;

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

const reducerHandlers = createReducer<EditorState, RootAction>({
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

const reducer: Reducer<EditorState, RootAction> = (state, action) => {
    state = reducerHandlers(state, action);
    assertStateInvariants(state);
    return state;
};

export type RootState = StateType<ReturnType<typeof reducer>>;
export default reducer;
