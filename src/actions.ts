import {createStandardAction} from 'typesafe-actions';

import {CaretPos} from './buildTokens';

export const setCaret = createStandardAction('SET_CARET')<CaretPos>();
export const moveCaret = createStandardAction('MOVE_CARET')<CaretPos>();
