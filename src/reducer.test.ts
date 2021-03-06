import {reduce} from 'lodash';
import reducer from './reducer';
import * as actions from './actions';

describe('caret pos reducer', () => {
    it('does not allow negative caret pos', () => {
        const state = {lines: ['aaaa'], caretPos: {line: 0, col: 2}};
        const {caretPos} = reducer(
            state,
            actions.setCaretAction({line: -1, col: -1}),
        );
        expect(caretPos).toEqual({line: 0, col: 0});
    });

    it('does not allow caret pos past last line', () => {
        const state = {lines: ['aaaa', 'aaa'], caretPos: {line: 0, col: 2}};
        const {caretPos} = reducer(
            state,
            actions.setCaretAction({line: 3, col: 0}),
        );
        expect(caretPos).toEqual({line: 2, col: 0});
    });

    it('does not allow caret pos past last col', () => {
        const state = {lines: ['aaaa', 'aaa'], caretPos: {line: 0, col: 2}};
        const {caretPos} = reducer(
            state,
            actions.setCaretAction({line: 1, col: 6}),
        );
        expect(caretPos).toEqual({line: 1, col: 3});
    });

    it('allows caret past last col when moving through lines', () => {
        const state = {
            lines: ['aaaaa', 'aaa', 'aaaaaaa'],
            caretPos: {line: 0, col: 5},
        };
        const {caretPos} = reduce(
            [
                actions.moveCaretAction({line: 1, col: 0}),
                actions.moveCaretAction({line: 1, col: 0}),
            ],
            reducer,
            state,
        );
        expect(caretPos).toEqual({line: 2, col: 5});
    });

    it('sets col and line correctly when moving from past last pos', () => {
        const state = {
            lines: ['aaaaa', 'aaa'],
            caretPos: {line: 100, col: 100},
        };
        const {caretPos} = reduce(
            [
                actions.moveCaretAction({line: -2, col: 0}),
                actions.moveCaretAction({line: 0, col: -2}),
            ],
            reducer,
            state,
        );
        expect(caretPos).toEqual({line: 0, col: 3});
    });

    it('handles simultaneous line and col moves correctly', () => {
        const state = {
            lines: ['aaaaa', 'aaa'],
            caretPos: {line: 100, col: 100},
        };
        const {caretPos} = reduce(
            [actions.moveCaretAction({line: -2, col: -2})],
            reducer,
            state,
        );
        expect(caretPos).toEqual({line: 0, col: 3});
    });
});

describe('char insert reducer', () => {
    it('inserts chars and moves caret', () => {
        const state = {lines: ['aaaacccc'], caretPos: {line: 0, col: 4}};
        const {lines, caretPos} = reducer(
            state,
            actions.insertCharsAction('bbb'),
        );
        expect(lines).toEqual(['aaaabbbcccc']);
        expect(caretPos).toEqual({line: 0, col: 7});
    });

    it('appends chars and moves caret', () => {
        const state = {lines: ['aaabbb'], caretPos: {line: 0, col: 8}};
        const {lines, caretPos} = reducer(
            state,
            actions.insertCharsAction('ccc'),
        );
        expect(lines).toEqual(['aaabbbccc']);
        expect(caretPos).toEqual({line: 0, col: 9});
    });

    it('prepends chars and moves caret', () => {
        const state = {lines: ['bbbccc'], caretPos: {line: 0, col: 0}};
        const {lines, caretPos} = reducer(
            state,
            actions.insertCharsAction('aaa'),
        );
        expect(lines).toEqual(['aaabbbccc']);
        expect(caretPos).toEqual({line: 0, col: 3});
    });

    it('inserts new lines', () => {
        const state = {lines: ['aaccc', 'ddd'], caretPos: {line: 0, col: 2}};
        const {lines, caretPos} = reducer(
            state,
            actions.insertCharsAction('\nbbb'),
        );
        expect(lines).toEqual(['aa', 'bbbccc', 'ddd']);
        expect(caretPos).toEqual({line: 1, col: 3});
    });
});
