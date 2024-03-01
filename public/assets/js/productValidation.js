function productValidation() {
    const name = document.getElementById('name').value;
    const price = document.getElementById('Price').value;
    const quantity = document.getElementById('quantity').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;

    
    const priceRegex = /^(?:[1-9]\d*|0)(?:\.\d+)?$/;


    if (!name || name.trim() === '') {
        showError('nameError', 'Only use Alphabets');
        removeErrorsAfterDelay('nameError');
        return false;
    } else if (!priceRegex.test(price) || price.trim() === '') {
        showError('priceError', 'Only use numbers');
        removeErrorsAfterDelay('priceError');
        return false;
    } else if (!priceRegex.test(quantity) || quantity.trim() === '') {
        showError('quantityError', 'Only use numbers');
        removeErrorsAfterDelay('quantityError');
        return false;
    } else if (description.length <= 10 || description.trim() === '') {
        showError('descriptionError', 'Only use Alphabets and more than 10 letters');
        removeErrorsAfterDelay('descriptionError');
        return false;
    } else {
        return true;
    }
}

function showError(id, message) {
    document.getElementById(id).innerText = message;
   
    return false;
}

function removeErrorsAfterDelay(errorId) {
    console.log("hehe");
    setTimeout(() => {
        document.getElementById(errorId).innerText = '';
    }, 3000);
}
