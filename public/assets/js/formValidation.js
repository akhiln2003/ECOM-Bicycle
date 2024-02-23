


   //form validation
   function validateForm() {
    // Clear previous error messages and borders
    clearErrorsAndBorders();

    // Get form fields
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    const gender = document.getElementById('gender').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('ConformPassword').value;
    console.log(password , confirmPassword)

    // Validate name (non-empty)
    const nameRegex = /^[a-zA-Z\s]+$/;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Validate mobile number (10 digits)
    const mobileRegex = /^(?:(\d)\1{9}|[^0\D])\d{9}$/;
        // Validate password and confirm password match
        const passwordRegex =/^(?=.[a-z])(?=.[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/


    if (!nameRegex.test(name)) {
      showError('nameError', 'Only use Alphabets');
      
      return false;
    }

    else if (!emailRegex.test(email)) {
      showError('emailError', 'Invalid email address');
      return false;
    }

   else if (!mobileRegex.test(mobile)) {
      showError('mobileError', 'Invalid mobile number');
      return false;
    }

    // Validate date of birth
    else if (!dateOfBirth) {
      showError('dateOfBirthError', 'Please select a valid date of birth');
      return false;
    }

    // Validate gender
   else if (gender === 'Select') {
      showError('genderError', 'Please select your gender');
      return false;
    }

    else if (!passwordRegex.test(password)) {
      showError('passwordError', 'Passwords do not match or do not meet the criteria');
      
      return false;
    }
    else if(!passwordRegex.test(confirmPassword) || password != confirmPassword){
     showError('ConformPasswordError', 'Passwords do not match');
     return false;
  
    }
    else{
    return true;
  }
  }

  function clearErrorsAndBorders() {
    console.log('hai')
    const errorElements = document.querySelectorAll('.forml');
    errorElements.forEach((element) => (element.innerText = ''));

    const inputElements = document.querySelectorAll('.error-border');
    inputElements.forEach((element) => element.classList.remove('error-border'));
  }

  function showError(id, message) {
    document.getElementById(id).innerText = message;
    document.getElementById(id.replace('Error', '')).classList.add('error-border');
   return false;
  }


  


////////////////////////////////////////////////

// <<<<<<<<<<<<<<<<<<<<<<<<<<<OTP resend>>>>>>>>>>>>>>>>>>>>>>>>>>




  function resend() {
    console.log("Hello");
    clearInterval(countdownInterval);
    startCountdown(60);
  }

  let countdownInterval;

  function startCountdown(initialValue) {
    let val = initialValue;
    countdownInterval = setInterval(() => {
      if(val===0){
        clearInterval(countdownInterval)
      }
      document.querySelector('#time').innerHTML = `${val}`;
      val = val - 1;
    }, 1000);
  }

  startCountdown(60);

  document.getElementById('resend').addEventListener('click', function () {
    resend();
  });