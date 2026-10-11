import { createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

const _hoisted_1 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "20",
  height: "20",
  fill: "none",
  viewBox: "0 0 20 20"
}

export function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("svg", _hoisted_1, [...(_cache[0] || (_cache[0] = [
    _createElementVNode("path", {
      stroke: "currentColor",
      "stroke-linejoin": "round",
      "stroke-width": "1.667",
      d: "M13.333 2.917c-1.667 0-2.709 1.041-3.334 1.666-.625-.625-1.666-1.666-3.333-1.666-2.083 0-3.333.833-4.167 2.083s-1.329 3.873.417 6.667c2.083 3.333 5.417 5.416 7.083 6.25 1.667-.834 5-2.917 7.084-6.25 1.9-3.04 1.25-5.417.416-6.667-.833-1.25-2.083-2.083-4.166-2.083Z"
    }, null, -1)
  ]))]))
}
export default { render: render }