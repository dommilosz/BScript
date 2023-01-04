let g_codeEditor = null

function main() {
    setupEditor()
    onResize()

    document.body.onresize = onResize
    window.onkeydown = onKeyDown
    window.onbeforeunload = onBeforeUnload
}


function setupEditor() {
    g_codeEditor = CodeMirror(document.getElementById("divCodeMirror"),
        {
            lineNumbers: true, matchBrackets: true, indentWithTabs: true, highlightSelectionMatches: true,
            tabSize: 4, indentUnit: 4, mode: "z80"
        })

    fetch("../examples/basic.bs")
        .then(r => r.text())
        .then(r => g_codeEditor.setValue(r))

    g_codeEditor.refresh()
}

function onResize() {
    let rectInput = document.getElementById("divCodeMirror").getBoundingClientRect()
    g_codeEditor.setSize(rectInput.width, rectInput.height)
}


function onBeforeUnload() {
    return "Your work will be lost if you close the page."
}


function onKeyDown(ev) {
    if (!ev.ctrlKey)
        return

    if (ev.key == "Enter") {
        ev.preventDefault()
        run()
    }
}


function run() {
    let format = document.getElementById("selectFormat").value;
    let isRun = !!Number(format.split(",")[0]);
    let verbose = Number(format.split(",")[1]);

    console.log(`Running: run: ${isRun}, verboseness: ${verbose}`);

    let divText = document.getElementById("divOutputText");
    let code = g_codeEditor.getValue();
    let evalCode = transpile(code, verbose);
    let output = "";
    divText.style.color = "";
    if (isRun) {
        console.log = function (args) {
            output += args + "\n";
        }

        try {
            eval(evalCode);
        } catch (ex2) {
            divText.style.color = "red";
            output = `${ex2}`;
        }
    } else {
        output = evalCode;
    }

    divText.innerHTML = output;
    divText.style.whiteSpace = "no-wrap"
}