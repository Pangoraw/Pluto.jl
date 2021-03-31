// @ts-ignore
const CodeMirror = window.CodeMirror;

CodeMirror.defineMode("juliamixed", function (config, parserConfig) {
  const juliaMode = CodeMirror.getMode(config, {
    name: "julia",
  });

  return {
    startState: function() {
      const state = CodeMirror.startState(juliaMode);
      return { juliaState: state };
    },
    copyState: function(state) {
      var local;
      if (state.localState) {
        local = CodeMirror.copyState(state.localMode, state.localMode);
      }
      return {token: state.token, inTag: state.inTag, localMode: state.localMode,
        localState: local, juliaState: CodeMirror.copyState(juliaMode, state.juliaState)}
    },
    token: function (stream, state) {

    },
    indent: function (state, textAfter, line) {

    },
    innerMode: function (state) {
      return {state: state.localState || state.juliaState, mode: state.localMode || juliaMode};
    }
  }
});