// Form validation function
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

  // Validation regex patterns
  const nameRegex = /^[a-zA-Z\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^(?:(\d)\1{9}|[^0\D])\d{9}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d.)[a-zA-Z\d]{6,}$/;

  // Validate name
  if (!nameRegex.test(name)) {
      showError('nameError', 'Only use Alphabets');
      removeErrorsAfterDelay('nameError');
      return false;
  }
  // Validate email
  else if (!emailRegex.test(email)) {
      showError('emailError', 'Invalid email address');
      removeErrorsAfterDelay('emailError');
      return false;
  }
  // Validate mobile
  else if (!mobileRegex.test(mobile)) {
      showError('mobileError', 'Invalid mobile number');
      removeErrorsAfterDelay('mobileError');
      return false;
  }
  // Validate date of birth
  else if (!dateOfBirth) {
      showError('dateOfBirthError', 'Please select a valid date of birth');
      removeErrorsAfterDelay('dateOfBirthError');
      return false;
  }
  // Validate gender
  else if (gender === 'Select') {
      showError('genderError', 'Please select your gender');
      removeErrorsAfterDelay('genderError');
      return false;
  }
  // Validate Password
  else if (!passwordRegex.test(password)) {
      showError('passwordError', 'Passwords do not meet the criteria');
      removeErrorsAfterDelay('passwordError');
      return false;
  }
  // Validate confirmPassword
  else if (!passwordRegex.test(confirmPassword) || password != confirmPassword) {
      showError('ConformPasswordError', 'Passwords do not match');
      removeErrorsAfterDelay('ConformPasswordError');
      return false;
  } else {
      return true;
  }
}

// Function to remove errors after a delay
function removeErrorsAfterDelay(errorId) {
  setTimeout(() => {
      document.getElementById(errorId).innerText = '';
      document.getElementById(errorId.replace('Error', '')).classList.remove('error-border');
  }, 3000); 
}

// Function to clear errors and borders
function clearErrorsAndBorders() {
  const errorElements = document.querySelectorAll('.forml');
  errorElements.forEach((element) => (element.innerText = ''));

  const inputElements = document.querySelectorAll('.error-border');
  inputElements.forEach((element) => element.classList.remove('error-border'));
}

// Function to show error
function showError(id, message) {
  document.getElementById(id).innerText = message;
  document.getElementById(id.replace('Error', '')).classList.add('error-border');
  return false;
}
