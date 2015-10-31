// A trivial 'render' function for my component^Wapplication
module.exports = function render(formatter) {
    document.querySelector('p').innerText =
        formatter.format("bag", { items: 2});
}
