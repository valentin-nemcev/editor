import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {Editor} from './editor'

const e = React.createElement

const sampleText = `
import {sum} from './sum'

test('basic', () => {
    expect(sum()).toBe(0)
})

test('basic again', () => {
    expect(sum(1, 2)).toBe(3)
})
`.trim()

const appContainer = document.createElement('div')
document.body.appendChild(appContainer)

ReactDOM.render(e(Editor, {initialText: sampleText}), appContainer)
