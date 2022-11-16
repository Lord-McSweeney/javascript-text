function insertCharAtPosition(string, char, pos) {
    return string.slice(0, pos) + char + string.slice(pos, string.length);
}

function setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    }
}

function setCaretToPos (input, pos) {
       setSelectionRange(input, pos, pos);
}

function launchGame(fn) {
    var win = window.open("about:blank");
    var textarea = win.document.createElement("textarea");
    textarea.style.width = "800px";
    textarea.style.height = "400px";
    textarea.style.resize = "none";
    textarea.style.border = "1px solid black";
    win.fn = fn;
    win.API = {
        timing: {
        }
    };
    win.setInterval(function() {
        setCaretToPos(textarea, textarea.value.length);
    }, 5);
    win.API.TextDisplayer = function(txtarea) {
        if (!txtarea) {
            txtarea = textarea;
        }
        this.textarea = txtarea;
        this.currentTextualInput = "";
        this.actualData = "";
        this.waitingForInput = false;
        this.input = async function() {
            this.waitingForInput = true;
            return await new Promise((resolve, reject) => {
                console.log(this.textarea);
                var realthis = this;
                this.textarea.onkeydown = function (e) {
                    if (e.key !== "Backspace") {
                        realthis.currentTextualInput += e.key === "Enter" ? "\n" : (e.key.length > 1 ? "" : e.key);
                        if (e.key === "Enter") {
                            this.onkeydown = function (e) {
                                e.preventDefault();
                            }
                            e.preventDefault();
                            this.value += "\n";
                            realthis.waitingForInput = false;
                            realthis.actualData += realthis.currentTextualInput;
                            resolve(realthis.currentTextualInput);
                        }
                    } else {
                        if (realthis.textarea.value.length === realthis.actualData.length) {
                            e.preventDefault();
                        } else {
                            realthis.currentTextualInput = realthis.currentTextualInput.slice(0, -1);
                        }
                    }
                }
            });
        }
        this.print = function(txt) {
            if (!this.waitingForInput) {
                this.actualData += (txt === undefined ? "" : txt);
                this.textarea.value += (txt === undefined ? "" : txt);
            }
        }
        this.textarea.onkeydown = function(e) {
            e.preventDefault();
        }
    }
    win.API.timing.sleep = async function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    win.API.timing.now = function() {
        return Date.now();
    }
    win.document.body.append(textarea);
    fn(win, win.API.TextDisplayer);
}
async function game(win, TextDisplayer, TextCanvas) {
    console.log(TextDisplayer);
    var textinterface = new TextDisplayer();
    textinterface.print("hello!");
    console.log(textinterface.textarea);
    var input = await textinterface.input();
    textinterface.print("You said: "+ input);
}
launchGame(game);
