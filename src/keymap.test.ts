import {eventToKey} from './keymap';

describe('eventToKey', () => {
    test('skips modifiers', () => {
        const e = new KeyboardEvent('keydown', {
            key: 'Shift',
            code: 'LeftShift',
            shiftKey: true,
        });
        expect(eventToKey(e)).toBeNull();
    });

    test('control keys', () => {
        const e = new KeyboardEvent('keydown', {
            key: 'ArrowLeft',
            code: 'ArrowLeft',
        });
        expect(eventToKey(e)).toEqual({
            name: 'ArrowLeft',
            char: null,
        });
    });

    test('input keys', () => {
        const e = new KeyboardEvent('keydown', {
            key: 'j',
            code: 'KeyJ',
        });
        expect(eventToKey(e)).toEqual({
            name: 'J',
            char: 'j',
        });
    });

    test('input keys with shift', () => {
        const e = new KeyboardEvent('keydown', {
            key: 'J',
            code: 'KeyJ',
            shiftKey: true,
        });
        e.getModifierState = jest.fn(m => m === 'Shift');

        expect(eventToKey(e)).toEqual({
            name: 'Shift+J',
            char: 'J',
        });
    });

    test('digits keys with shift', () => {
        const e = new KeyboardEvent('keydown', {
            key: '^',
            code: 'Digit6',
            shiftKey: true,
        });
        e.getModifierState = jest.fn(m => m === 'Shift');

        expect(eventToKey(e)).toEqual({
            name: 'Shift+6',
            char: '^',
        });
    });

    test('space', () => {
        const e = new KeyboardEvent('keydown', {
            key: ' ',
            code: 'Space',
        });

        expect(eventToKey(e)).toEqual({
            name: 'Space',
            char: ' ',
        });
    });
});
