
// Size of hex tile margin relative to width of tile
const margin = 1 / 5;

const svg_height = 112;
const svg_width = 97;

// Hex tile scaling factors
const hex_w = Math.sqrt(3);
const hex_h = 2;
const hex_margin_w = margin;
const hex_margin_h = (Math.sqrt(3) * margin - 1) / 2;

// Hex tile colors
const hex_colors = ["none", "red", "yellow", "green", "cyan", "blue", "purple"]

// Slider element for scaling hex tiles
var slider;

function set_css_var(name, val) {
    document.documentElement.style.setProperty(name, val);
}

function set_hex_scale(scale) {
    set_css_var("--hex-w", (hex_w * scale) + "px");
    set_css_var("--hex-h", (hex_h * scale) + "px");
    set_css_var("--hex-margin-w", (hex_margin_w * scale) + "px");
    set_css_var("--hex-margin-h", (hex_margin_h * scale) + "px");
}

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
