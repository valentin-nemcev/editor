import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider, ProviderProps} from 'react-redux';

import reducer, {RootAction} from './reducer';
import Editor from './Editor';

const e = React.createElement;

const sampleText = `
import {sum} from './sum'

test('basic', () => {
    expect(sum()).toBe(0)
})

test('basic again', () => {
    expect(sum(1, 2)).toBe(3)
})
`.trim();

const store = createStore(reducer, {
    lines: sampleText.split('\n'),
    caretPos: {line: 3, col: 5},
});

const appContainer = document.createElement('div');
document.body.appendChild(appContainer);

ReactDOM.render(
    e(
        Provider as React.ComponentClass<ProviderProps<RootAction>>,
        {store},
        e(Editor, {}),
    ),
    appContainer,
);
