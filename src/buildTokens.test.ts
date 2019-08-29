import {buildTokens} from './buildTokens';

describe('buildTokens', () => {
    test('multiple lines with caret', () => {
        expect(
            buildTokens({
                lines: ['line1', 'line2'],
                caretPos: {line: 1, col: 4},
            }),
        ).toEqual([
            [{kind: 'string', offset: {line: 0, col: 0}, text: 'line1'}],
            [
                {kind: 'string', offset: {line: 1, col: 0}, text: 'line'},
                {kind: 'caret', offset: {line: 1, col: 4}},
                {kind: 'string', offset: {line: 1, col: 4}, text: '2'},
            ],
        ]);
    });

    test('caret at empty line', () => {
        expect(
            buildTokens({
                lines: [''],
                caretPos: {line: 0, col: 0},
            }),
        ).toEqual([
            [
                {kind: 'string', offset: {line: 0, col: 0}, text: ''},
                {kind: 'caret', offset: {line: 0, col: 0}},
            ],
        ]);
    });

    test('negative caret at empty line', () => {
        expect(
            buildTokens({
                lines: [''],
                caretPos: {line: 0, col: -1},
            }),
        ).toEqual([
            [
                {kind: 'string', offset: {line: 0, col: 0}, text: ''},
                {kind: 'caret', offset: {line: 0, col: 0}},
            ],
        ]);
    });

    test('caret at the start of the line', () => {
        expect(
            buildTokens({
                lines: ['line1'],
                caretPos: {line: 0, col: 0},
            }),
        ).toEqual([
            [
                {kind: 'caret', offset: {line: 0, col: 0}},
                {kind: 'string', offset: {line: 0, col: 0}, text: 'line1'},
            ],
        ]);
    });

    test('negative caret col', () => {
        expect(
            buildTokens({
                lines: ['line1'],
                caretPos: {line: 0, col: -10},
            }),
        ).toEqual([
            [
                {kind: 'caret', offset: {line: 0, col: 0}},
                {kind: 'string', offset: {line: 0, col: 0}, text: 'line1'},
            ],
        ]);
    });

    test('caret past the end of the line', () => {
        expect(
            buildTokens({
                lines: ['line1'],
                caretPos: {line: 0, col: 100},
            }),
        ).toEqual([
            [
                {kind: 'string', offset: {line: 0, col: 0}, text: 'line1'},
                {kind: 'caret', offset: {line: 0, col: 5}},
            ],
        ]);
    });
});
