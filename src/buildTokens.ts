import {compact, clamp} from 'lodash';

export type CaretPos = {line: number; col: number};
export type TokenKind = 'string' | 'caret';

class BaseToken {
    constructor(public offset: CaretPos) {}
}

export class StringToken extends BaseToken {
    kind: 'string' = 'string';
    constructor(offset: CaretPos, public text: string) {
        super(offset);
    }
}

export class CaretToken extends BaseToken {
    kind: 'caret' = 'caret';
}

export type Token = StringToken | CaretToken;

export function buildTokens({
    lines,
    caretPos,
}: {
    lines: string[];
    caretPos: CaretPos;
}): Token[][] {
    const tokens = lines.map((line, i) => {
        if (caretPos.line !== i)
            return [new StringToken({line: i, col: 0}, line)];
        else {
            const col = clamp(caretPos.col, line.length);
            return compact([
                (col > 0 || line.length === 0) &&
                    new StringToken({line: i, col: 0}, line.slice(0, col)),
                new CaretToken({line: i, col}),
                col < line.length &&
                    new StringToken({line: i, col: col}, line.slice(col)),
            ]);
        }
    });
    if (caretPos.line >= lines.length)
        tokens.push([new CaretToken({line: lines.length, col: 0})]);
    return tokens;
}
