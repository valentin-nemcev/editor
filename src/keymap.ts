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

function keymap(
    e: KeyboardEvent,
    dispatch: Dispatch<ActionType<typeof actions>>,
): void {
    const key = eventToKey(e);
    if (!key) return;
    const controlAction = (() => {
        switch (key.name) {
            case 'ArrowUp':
                return actions.moveCaretAction({line: -1, col: 0});
            case 'ArrowDown':
                return actions.moveCaretAction({line: 1, col: 0});
            case 'ArrowLeft':
                return actions.moveCaretAction({line: 0, col: -1});
            case 'ArrowRight':
                return actions.moveCaretAction({line: 0, col: 1});
        }
    })();
    if (controlAction) {
        dispatch(controlAction);
        return;
    }
    if (key.char != null) {
        dispatch(actions.insertCharAction(key.char));
    }
}
export default keymap;
export {eventToKey};
