import { TEXT_ELEMENT } from "./constants";

// es6 写法
export class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {};
  }

  setState(partialState) {
    this.state = Object.assign({}, this.state, partialState);
    // 内部实例的引用
    updateInstance(this.__internalInstance); // 更新 虚拟-Dom树和 更新 html
  }
}

function updateInstance(internalInstance) {

  const parentDom = internalInstance.dom.parentNode;
  const element = internalInstance.element;

  reconcile(parentDom, internalInstance, element); // 对比-虚拟dom树
}

function createPublicInstance(element, internalInstance) {
  // 当 元素进到这里来, 说明
  // type 是 一个函数
  const { type, props } = element;
  // 新建-实例
  const publicInstance = new type(props);
  // 
  publicInstance.__internalInstance = internalInstance; // 
  return publicInstance;
}


let rootInstance = null
function render (element, container) {
  const prevInstance = rootInstance
  const nextInstance = reconcile(container, prevInstance, element)
  rootInstance = nextInstance
}

function reconcile(parentDom, instance, element) {
  if (instance == null) {
    // 第一次渲染，虚拟dom为null
    const newInstance = instantiate(element); 
    parentDom.appendChild(newInstance.dom);
    return newInstance;
  } else if (element == null) { // <---- 1
    // Remove instance
    parentDom.removeChild(instance.dom);
    return null;
  } else if(instance.element.type !== element.type) {
    // 更新渲染，替换
    const newInstance = instantiate(element);
    parentDom.replaceChild(newInstance.dom, instance.dom);
    return newInstance;
  } else if(typeof element.type === "string") {
    updateDomProperties(instance.dom, instance.element.props, element.props)
    instance.childInstances = reconcileChildren(instance, element);
    instance.element = element;
    return instance;
  } else {
    instance.publicInstance.props = element.props; // 更新-props
    const childElement = instance.publicInstance.render(); // 组件的render函数 
    const oldChildInstance = instance.childInstance;
    const childInstance = reconcile(parentDom, oldChildInstance, childElement); // 对比-剩下-孩子
    instance.dom = childInstance.dom; // 更新-dom
    instance.childInstance = childInstance; // 更新-虚拟dom数
    instance.element = element; // 更新-Didact元素
    return instance;
  }
}

function reconcileChildren(instance, element) {
  // instance 旧
  // element 新
  const dom = instance.dom;
  const childInstances = instance.childInstances;
  const nextChildElements = element.props.children || [];
  const newChildInstances = []; // 新的孩子数组

  const count = Math.max(childInstances.length, nextChildElements.length); // 比较谁-大

  for (let i = 0; i < count; i++) {
    const childInstance = childInstances[i];
    const childElement = nextChildElements[i];

// 2. 递归 - 上一层函数 reconcile
    const newChildInstance = reconcile(dom, childInstance, childElement);
    newChildInstances.push(newChildInstance);
  }
  return newChildInstances;
}

function instantiate(element) {
  const { type, props } = element; // 获取类型 和 属性对象
  const isDomElement = typeof type === "string";
  if (isDomElement) {
    
    // Create DOM element
    const isTextElement = type === TEXT_ELEMENT; // 文本类型判定
    const dom = isTextElement
      ? document.createTextNode('')
      : document.createElement(type);
  
    updateDomProperties(dom, {}, props);
  
    // Render children
    const childElements = props.children || [];
  
    const childInstances = childElements.map(instantiate)
  
    const childDoms = childInstances.map(childInstance => childInstance.dom);
  
    childDoms.forEach(childDom => dom.appendChild(childDom));
  
  
    const instance = { dom, element, childInstances };
  
    return instance;
  } else {
    const instance = {};

    // createPublicInstance 
    // 1. 新建 newApp = new App() 
    // 2. newApp.__internalInstance = instance
    // 3. publicInstance = newApp
    const publicInstance = createPublicInstance(element, instance);
    // 
    const childElement = publicInstance.render(); // 自己定义的 渲染-render-函数

    const childInstance = instantiate(childElement); // 递归 孩子拿到 { dom, element, childInstances }
    const dom = childInstance.dom;

    Object.assign(instance, { dom, element, childInstance, publicInstance }); // >> 组件元素比Didact元素 多了本身- 实例
    return instance;
  }
}

function updateDomProperties(dom, prevProps, nextProps) {
  const isEvent = name => name.startsWith("on");
  const isAttribute = name => !isEvent(name) && name != "children";

// preProps Remove
  // Remove event listeners
  Object.keys(prevProps).filter(isEvent).forEach(name => {
    const eventType = name.toLowerCase().substring(2);
    dom.removeEventListener(eventType, prevProps[name]);
  });

  // Remove attributes
  Object.keys(prevProps).filter(isAttribute).forEach(name => {
    dom[name] = null;
  });

// nextProps Add
  // Set attributes
  Object.keys(nextProps).filter(isAttribute).forEach(name => {
    dom[name] = nextProps[name];
  });

  // Add event listeners
  Object.keys(nextProps).filter(isEvent).forEach(name => {
    const eventType = name.toLowerCase().substring(2);
    dom.addEventListener(eventType, nextProps[name]);
  });
}





export default {
  render
}