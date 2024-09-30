// Initialize the orderedDivs input with the default order

const level = document.getElementById("level");
const level_value = document.getElementById("level_value");
level_value.textContent = level.value;
level.oninput = function() {
    level_value.textContent = this.value;
}

// LIST: to vs when for while random


document.addEventListener("DOMContentLoaded", function() {
    var orderedDivs = [];
    document.querySelectorAll('.sortable-item').forEach(function(div) {
        orderedDivs.push(div.getAttribute('data-id'));
    });
    document.querySelector('input[name="ordered_divs"]').value = orderedDivs.join(',');
});
var sortable = new Sortable(document.getElementById('sortable-container'), {
    animation: 150,
    onEnd: function (evt) {
        var orderedDivs = [];
        document.querySelectorAll('.sortable-item').forEach(function(div) {
            orderedDivs.push(div.getAttribute('data-id'));
        });
        document.querySelector('input[name="ordered_divs"]').value = orderedDivs.join(',');
    }
});