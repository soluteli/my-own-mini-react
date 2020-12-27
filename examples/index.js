import ReactDOM from 'react-dom'

const element = {
  type: "div",
  props: {
    id: "container",
    children: [
      { type: "input", props: { value: "foo", type: "text" }},
      { type: "a", props: { href: "/bar" } },
      { type: "span", props: {
        onClick: () => console.log('click'),
        children: [{
          type: "TEXT ELEMENT",
          value: 'span text',
          props: {}
        }]
      } }
    ]
  }
};

ReactDOM.render(element, document.getElementById('app'))
