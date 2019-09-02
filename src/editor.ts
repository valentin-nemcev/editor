import * as React from 'react';
import {connect} from 'react-redux';

import {RootState} from './store';
import {setCaret, moveCaret} from './actions';
import {EditorLines} from './editorLines';
import {buildTokens} from './buildTokens';

const e = React.createElement;

const mapStateToProps = (state: RootState) => ({lines: buildTokens(state)});
const dispatchProps = {setCaret, moveCaret};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

const Editor = ({lines, setCaret, moveCaret}: Props) =>
    e(EditorLines, {
        lines,
        setCaret,
        moveCaret,
    });

export default connect(
    mapStateToProps,
    dispatchProps,
)(Editor);
