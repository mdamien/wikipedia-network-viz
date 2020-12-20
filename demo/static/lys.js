L = {};

var flattenArray = function (array) {
	var is_flat = false
	while (!is_flat) {
		is_flat = true
		var flattened = []
		array.forEach(node => {
			if (node instanceof Array) {
				is_flat = false
				node.forEach(node2 => {
					flattened.push(node2)
				})
			} else {
				flattened.push(node)
			}
		})
		array = flattened
	}
	return array;
}

L.el = function (name, content, attrs) {
	var node = document.createElement(name)

	// TODO: support nested arrays
	if (content instanceof Array) {
		content = flattenArray(content)
		content.forEach(node2 => {
			if (node2) {
				node.appendChild(L.span(node2).firstChild)
			}		
		})
	} else if (content instanceof HTMLElement) {
		node.appendChild(content)
	} else if (content) {
		var content_node = document.createTextNode(content)
		node.appendChild(content_node)
	}

	if (attrs) {
		for (var key in attrs) {
			node.setAttribute(key, attrs[key])
		}
	}

	return node
}

var html_elements = ['strong', 'br', 'ul', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'span', 'div', 'hr', 'p', 'input']
html_elements.forEach(el => {
	L[el] = function (content, attrs) {
		return L.el(el, content, attrs)
	}
})

L.render = function (node) {
	return L.span(node).innerHTML
}