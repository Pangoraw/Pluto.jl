import { EditorView, syntaxTree, Decoration, ViewUpdate, ViewPlugin, Facet } from "../../imports/CodemirrorPlutoSetup.js"


function make_print_diagnostic(from, to, fname) {
	return make_diagnostic({ from, to, message: `The ${fname} function should be used with with_terminal()` })
}

function make_diagnostic({ from, to, message } = { message: "" }) {
	return {
		from,
		to,
		severity: "warning",
		source: "julia_linter",
		message,
		actions: [],
	}
}

/**
 * @param {EditorView} view
 * @param {Object} props
 */
export function julia_linter(view, _) {
	const diagnostics = []

	for (let { from, to } of view.visibleRanges) {
		let is_inside_with_terminal_call = false
		let is_inside_call_expression = false
		syntaxTree(view.state).iterate({
			from,
			to,
			enter: (type, from, to, getNode) => {
				console.log("enter", type.name);

				if (type.name === "CallExpression") {
					is_inside_call_expression = true
				}

				if (type.name === "Identifier") {
					if (is_inside_call_expression) {
						let identifier = view.state.doc.sliceString(from, to)
						if (identifier === "with_terminal") {
							is_inside_call_expression = false
						}
					}

					if (is_inside_with_terminal_call) {
						let identifier = view.state.doc.sliceString(from, to)
						if (identifier === "print" || identifier === "println") {
							diagnostics.push(make_print_diagnostic(from, to, identifier))
						}
					}
				}

			},
			leave: (type, from, to) => {
				console.log("leaving", type.name)
				if (type.name === "CallExpression") {
					is_inside_call_expression = false
				}
			},
		});
	}

	return diagnostics
}