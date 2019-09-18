import {createReducer, StateType, ActionType} from 'typesafe-actions';
import {
    EditorState,
    setCaretPos,
    moveCaretPos,
    insertChars,
    deleteChars,
    assertStateInvariants,
} from './state';

import * as actions from './actions';

export type RootAction = ActionType<typeof actions>;

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
        actions.insertCharsAction,
        ({lines, caretPos}, {payload: chars}) => {
            const {updatedCaretPos, updatedLines} = insertChars(
                lines,
                caretPos,
                chars,
            );
            return {lines: updatedLines, caretPos: updatedCaretPos};
        },
    )
    .handleAction(
        actions.deleteCharsAction,
        ({lines, caretPos}, {payload: deltaCol}) => {
            const {updatedCaretPos, updatedLines} = deleteChars(
                lines,
                caretPos,
                deltaCol,
            );
            return {lines: updatedLines, caretPos: updatedCaretPos};
        },
    )
    .handleAction(actions.openLineAction, ({lines, caretPos}) => ({
        lines: [
            ...lines.slice(0, caretPos.line + 1),
            '',
            ...lines.slice(caretPos.line + 1),
        ],
        caretPos: {line: caretPos.line + 1, col: 0},
    }))
    .handleAction(actions.joinLinesAction, ({lines, caretPos}) => ({
        lines: [
            ...lines.slice(0, caretPos.line),
            lines.slice(caretPos.line, caretPos.line + 2).join(''),
            ...lines.slice(caretPos.line + 2),
        ],
        caretPos,
    }));

const reducer: typeof actionReducer = (state, action) => {
    state = actionReducer(state, action);
    assertStateInvariants(state);
    return state;
};
reducer.handlers = actionReducer.handlers;

export type RootState = StateType<ReturnType<typeof reducer>>;
export default reducer;
