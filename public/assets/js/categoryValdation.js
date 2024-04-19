


//Category validation
function categoryValidation() {
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;

  //Validation nameRegex 
  const nameRegex = /^[a-zA-Z\s]+$/;

  if (!nameRegex.test(name)) {
    showError('nameError', 'Only use Alphabets');
    removeErrorsAfterDelay('nameError');
    return false;
  } else if (name.value.trim() === '') {
    showError('nameError', 'Only use Alphabets');
    removeErrorsAfterDelay('nameError');

    return false
  }
  else if (description <= 10 || description.value.trim() === "") {
    showError('descriptionError', 'must need morethan 10 letters');
    removeErrorsAfterDelay('descriptionError');
    return false;
  } else {
    return true;
  }
}



function showError(id, message) {
  document.getElementById(id).innerText = message;
  document.getElementById(id.replace('Error', '')).classList.add('error-border');
  return false;
}


function removeErrorsAfterDelay(errorId) {
  setTimeout(() => {
    document.getElementById(errorId).innerText = '';
    document.getElementById(errorId.replace('Error', '')).classList.remove('error-border');
  }, 3000);
}


