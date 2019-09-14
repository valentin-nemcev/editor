import {createStandardAction} from 'typesafe-actions';

import {CaretPos} from './buildTokens';

export const setCaretAction = createStandardAction('SET_CARET')<CaretPos>();
export const moveCaretAction = createStandardAction('MOVE_CARET')<CaretPos>();

export const insertCharsAction = createStandardAction('INSERT_CHARS')<string>();
export const deleteCharsAction = createStandardAction('DELETE_CHARS')<number>();

export const openLineAction = createStandardAction('OPEN_LINE')<void>();
export const joinLinesAction = createStandardAction('JOIN_LINES')<void>();
