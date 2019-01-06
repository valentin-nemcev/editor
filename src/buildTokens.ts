import {compact, clamp} from 'lodash'

export type CaretPos = {line: number; col: number}
export type TokenKind = 'string' | 'caret'

class BaseToken {
    constructor(public offset: CaretPos) {}
}

export class StringToken extends BaseToken {
    kind: 'string' = 'string'
    constructor(offset: CaretPos, public text: string) {
        super(offset)
    }
}

export class CaretToken extends BaseToken {
    kind: 'caret' = 'caret'
}

export type Token = StringToken | CaretToken

export function buildTokens({
    lines,
    caretPos,
}: {
    lines: string[]
    caretPos: CaretPos
}): Token[][] {
    return lines.map((line, i) => {
        if (caretPos.line !== i)
            return [new StringToken({line: i, col: 0}, line)]
        else {
            const col = clamp(caretPos.col, 0, line.length)
            return compact([
                (caretPos.col > 0 || line.length === 0) &&
                    new StringToken({line: i, col: 0}, line.slice(0, col)),
                new CaretToken({line: i, col}),
                caretPos.col < line.length &&
                    new StringToken({line: i, col: col}, line.slice(col)),
            ])
        }
    })
}
