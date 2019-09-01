import {clamp} from 'lodash';

import * as React from 'react';
import {EditorLines} from './editorLines';
import {buildTokens, CaretPos} from './buildTokens';

const e = React.createElement;

interface EditorProps {
    initialText: string;
}

interface EditorState {
    lines: string[];
    caretPos: CaretPos;
}

export class Editor extends React.Component<EditorProps, EditorState> {
    setCaret = (caretPos: CaretPos): void => this.setState({caretPos});
    moveCaret = (delta: CaretPos): void =>
        this.setState(({lines, caretPos}) => ({
            caretPos: {
                line: clamp(caretPos.line + delta.line, 0, lines.length - 1),
                col: clamp(
                    caretPos.col + delta.col,
                    0,
                    Math.max(caretPos.col, (lines[caretPos.line] || '').length),
                ),
            },
        }));

    constructor(props: EditorProps) {
        super(props);
        this.state = {
            lines: props.initialText.split('\n'),
            caretPos: {line: 3, col: 5},
        };
    }

    render(): React.ReactElement {
        return e(EditorLines, {
            lines: buildTokens(this.state),
            setCaret: this.setCaret,
            moveCaret: this.moveCaret,
        });
    }
}
