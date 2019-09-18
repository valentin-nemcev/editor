import assert from 'power-assert';
import {clamp} from 'lodash';

type CaretPos = {line: number; col: number};
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

function insertChars(
    lines: Lines,
    {line, col}: CaretPos,
    chars: string,
): {updatedLines: Lines; updatedCaretPos: CaretPos} {
    const insertedLines = chars.split('\n');
    const insertedCount = insertedLines.length - 1;

    const charsBefore = lines[line].slice(0, col);
    const charsAfter = lines[line].slice(col);

    insertedLines[0] = charsBefore + insertedLines[0];
    const updatedCol = insertedLines[insertedCount].length;
    insertedLines[insertedCount] = insertedLines[insertedCount] + charsAfter;

    const updatedLines = [
        ...lines.slice(0, line),
        ...insertedLines,
        ...lines.slice(line + 1),
    ];
    const updatedCaretPos = setCaretPos(
        {line: line + insertedCount, col: updatedCol},
        updatedLines,
    );

    return {updatedCaretPos, updatedLines};
}

function deleteChars(
    lines: Lines,
    caretPos: CaretPos,
    deltaCol: number,
): {updatedLines: Lines; updatedCaretPos: CaretPos} {
    const {min, max} = Math;
    caretPos = clampCaretPos(caretPos, lines);
    const line = lines[caretPos.line];
    const startPos = max(0, caretPos.col + min(deltaCol, 0));
    const endPos = caretPos.col + max(deltaCol, 0);
    const updatedLines = [
        ...lines.slice(0, caretPos.line),
        line.slice(0, startPos) + line.slice(endPos),
        ...lines.slice(caretPos.line + 1),
    ];
    return {
        updatedLines,
        updatedCaretPos: {line: caretPos.line, col: startPos},
    };
}

const assertStateInvariants = (state: EditorState): void => {
    const {lines, caretPos} = state;
    try {
        assert(caretPos.line >= 0);
        assert(caretPos.col >= 0);
        lines.forEach((line, i) =>
            assert(!line.includes('\n'), `Line ${i} contains newlines`),
        );
    } catch (e) {
        if (process.env.NODE_ENV !== 'test')
            throw new Error('Assertion failed \n' + e.message);
        else throw e;
    }
};

export {
    CaretPos,
    Lines,
    EditorState,
    setCaretPos,
    moveCaretPos,
    insertChars,
    deleteChars,
    assertStateInvariants,
};
