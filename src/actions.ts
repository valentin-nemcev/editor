import {createStandardAction} from 'typesafe-actions';

import {CaretPos} from './buildTokens';

export const setCaretAction = createStandardAction('SET_CARET')<CaretPos>();
export const moveCaretAction = createStandardAction('MOVE_CARET')<CaretPos>();
