function checkInput(inputElement) {
    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) {
        deleteBtn.disabled = inputElement.value.length > 0;
    }
}