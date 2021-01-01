import ReactDOM from 'react-dom'
import React from 'react'

const APP = (count) => (
  <div id="container">
    {/* <input type="text" value="foo" /> */}
    {/* <a href="/bar" /> */}
    <button onClick={() => { countAdd(count)}}>{count}</button>
  </div>
)

function countAdd(count) {
  console.log('click',  count)
  ReactDOM.render(APP(count+1), document.getElementById('app'))
}



ReactDOM.render(APP(1), document.getElementById('app'))
