import ReactDOM from 'react-dom'
import React from 'react'
console.log('1')
const APP = (
  <div id="container">
    <input type="text" value="foo" />
    <a href="/bar" />
    <span onClick={() => {console.log('click')}}>span text</span>
  </div>
)

ReactDOM.render(APP, document.getElementById('app'))
