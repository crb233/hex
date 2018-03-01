
// Hex tile colors
const hex_colors = ["none", "red", "yellow", "green", "cyan", "blue", "purple"]

// Slider element for scaling hex tiles
var slider;

function hex_img_name(color) {
    return "img/hex-" + color + ".svg";
}

function hex_img_color(name) {
    let a = name.indexOf("-") + 1;
    let b = name.indexOf(".");
    return name.substr(a, b - a);
}

// Rotate the color of a hex tile
function hex_click() {
    let color = hex_img_color($(this).attr("src"));
    let ind = (hex_colors.indexOf(color) + 1) % hex_colors.length;
    $(this).attr("src", hex_img_name(hex_colors[ind]));
}

function hex_init() {
    $(".hex").not(".hidden").click(hex_click);
}

function slider_input() {
    // Set the scale of hex tiles
    set_hex_scale(parseInt(this.value));
}

function slider_init() {
    slider = document.getElementById("hex_size");
    slider.oninput = slider_input;
    slider.oninput();
}

function onresize() {
    let content = $("#content");
    let w = content.width();
    let h = content.height();
    
    let x = Math.floor((w - 4 * 16) / (hex_w + hex_margin_w));
    let y = Math.floor((h - 6 * 16) / (hex_h + hex_margin_h));
    
    // ...
    // ...
}

$(document).ready(function() {
    hex_init();
    slider_init();
    $(window).resize(onresize);
});
