
const fs = require("fs");
const path = require("path").join;

const COLORS = {
    "none":   ["#bbbbbb", "#dddddd", "#eeeeee"],
    "red":    ["#cc3333", "#ff5555", "#ff9988"],
    "yellow": ["#ccbb22", "#dddd44", "#eeee66"],
    "green":  ["#33aa33", "#55cc55", "#77ee77"],
    "cyan":   ["#00aaaa", "#00cccc", "#22eeee"],
    "blue":   ["#2244aa", "#4466dd", "#6688ff"],
    "purple": ["#bb00aa", "#dd22cc", "#ff44ee"]
}

function makeSvg(main, inner) {
    if (typeof inner === "undefined") {
        return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="582" height="672" viewbox="0 0 582 672">'
            + '<path fill="' + main + '" d="M291 000L582 168L582 504L291 672L000 504L000 168Z"></path>'
            + '</svg>';
        
    } else {
        return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="582" height="672" viewbox="0 0 582 672">'
            + '<path fill="' + main + '" d="M291 000L582 168L582 504L291 672L000 504L000 168Z"></path>'
            + '<path fill="' + inner + '" d="M291 112L485 224L485 448L291 560L097 448L097 224Z"></path>'
            + '</svg>';
    }
}

for (let color in COLORS) {
    let cs = COLORS[color];
    fs.writeFileSync(path(__dirname, "hex-" + color + ".svg"), makeSvg(cs[1]));
    fs.writeFileSync(path(__dirname, "hex-" + color + "-base.svg"), makeSvg(cs[0], cs[1]));
    fs.writeFileSync(path(__dirname, "hex-" + color + "-select.svg"), makeSvg(cs[2], cs[1]));
}
