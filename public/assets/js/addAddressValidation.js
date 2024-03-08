
function validation(){
   
    var name = document.getElementById('name').value;
    var state = document.getElementById('state').value;
    var city = document.getElementById('city').value;
    var pin = document.getElementById('pin').value;
    var phone = document.getElementById('phone').value;

    // Regex patterns for validation
    var nameRegex = /^[a-zA-Z\s]+$/; 
    var stateRegex = /^[a-zA-Z\s]+$/; 
    var cityRegex = /^[a-zA-Z\s]+$/; 
    var pinRegex = /^\d{6}$/;
    var phoneRegex = /^\d{10}$/; 

    if(!nameRegex.test(name) || name == " "){
      showError('nameError', ' Only use Alphabets');
      removeErrorsAfterDelay('nameError');
      return false;
    }else if(!stateRegex.test(state) || state == " "){
      showError('stateError', 'Only use Alphabets');
      removeErrorsAfterDelay('stateError');
      return false;
    }else if(!cityRegex.test(city) || city ==" "){
      showError('cityError', 'Only use Alphabets');
      removeErrorsAfterDelay('cityError');
      return false;
    }else if(!pinRegex.test(pin) || pin == " "){
      showError('pinError', 'Invalid PIN Number');
      removeErrorsAfterDelay('pinError');
      return false;
    }else if(!phoneRegex.test(phone)  || phone == " "){
      showError('phoneError', 'Invalid Mobile  Number');
      removeErrorsAfterDelay('phoneError');
      return false;
    }else{
        return true;
    }



}



function showError(id, message) {
    const errorElement = document.getElementById(id);
    errorElement.innerText = message;
    errorElement.classList.add('error-border');
    return false;
}

  function removeErrorsAfterDelay(errorId) {
    setTimeout(() => {
        const errorElement = document.getElementById(errorId);
        errorElement.innerText = '';
        errorElement.classList.remove('error-border');
    }, 3000);
}

