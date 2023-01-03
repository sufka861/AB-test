const experiment_type = document.getElementById('type');
const ab_test_attributes_display = document.getElementById('ab-test-attributes');
const new_experiment_box = document.getElementById('new-experiment');

experiment_type.addEventListener('change', function handleChange(event) {
    if (event.target.value === 'AB') {
        ab_test_attributes_display.style.display = 'block';
        new_experiment_box.style.height = "1360px";
    } else {
        ab_test_attributes_display.style.display = 'none';
        new_experiment_box.style.height = "900px";

    }
});
