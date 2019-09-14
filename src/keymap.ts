import {Dispatch} from 'redux';
import {ActionType} from 'typesafe-actions';
import * as actions from './actions';
const modifierNames = ['Alt', 'Control', 'Meta', 'Shift'] as const;
type Modifier = (typeof modifierNames)[number];
type Key = {
    name: string | null;
    char: string | null;
};

function eventToKey(e: KeyboardEvent): Key | null {
    const {key, code} = e;
    if ((modifierNames as readonly string[]).includes(key)) return null;
    const chars = Array.from(key);

    const modifiers: Modifier[] = [];
    for (const m of modifierNames) {
        if (e.getModifierState(m)) modifiers.push(m);
    }

    return {
        name: [...modifiers, code.replace(/^Key|Digit/, '')].join('+'),
        char: chars.length === 1 ? chars[0] : null,
    };
}

const map: {[key: string]: () => ActionType<typeof actions>} = {
    ArrowUp: () => actions.moveCaretAction({line: -1, col: 0}),
    ArrowDown: () => actions.moveCaretAction({line: 1, col: 0}),
    ArrowLeft: () => actions.moveCaretAction({line: 0, col: -1}),
    ArrowRight: () => actions.moveCaretAction({line: 0, col: 1}),

    Enter: () => actions.insertCharsAction('\n'),

    Delete: () => actions.deleteCharsAction(1),
    Backspace: () => actions.deleteCharsAction(-1),

    'Meta+O': () => actions.openLineAction(),
    'Meta+J': () => actions.joinLinesAction(),
};

function keymap(
    e: KeyboardEvent,
    dispatch: Dispatch<ActionType<typeof actions>>,
): void {
    const key = eventToKey(e);
    if (!key) return;

    console.log(key.name);

    if (key.name && key.name in map) {
        dispatch(map[key.name]());
    } else if (key.char != null) {
        dispatch(actions.insertCharsAction(key.char));
    }
}
export default keymap;
export {eventToKey};
