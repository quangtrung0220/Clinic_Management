import Validator, { INPUT_TYPE, ERROR } from "./validator.js";

const MAIN_FORM_ID = '#main-form';

// Function to create the form dynamically
const createForm = () => {
   const mainForm = document.querySelector(MAIN_FORM_ID);
   if (mainForm) {
      const htmlStr =
         `
         <h3 class="heading">Create New User</h3>
         <p class="desc">Page logo here</p>

         <div class="spacer"></div>

         <div class="form-group">
            <label for="fullname" class="form-label">Username</label>
            <input type="text" data-type=${INPUT_TYPE.USER_NAME} name="fullname" id="fullname" class="form-control" placeholder="Ex: Quang Trung">
            <span class="form-message"></span>
         </div>

         <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input type="text" data-type=${INPUT_TYPE.USER_EMAIL} name="email" id="email" class="form-control" placeholder="Ex: abc@email.com">
            <span class="form-message"></span>
         </div>

         <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input type="text" data-type=${INPUT_TYPE.USER_PASSWORD} name="password" id="password" class="form-control" placeholder="Password">
            <span class="form-message"></span>
         </div>

         <div class="form-group">
            <label for="password_confirmation" class="form-label">Re-enter password</label>
            <input type="text" data-type=${INPUT_TYPE.USER_PASSWORD_CONFIRMATION} name="password_confirmation" id="password_confirmation" class="form-control" placeholder="Confirm password">
            <span class="form-message"></span>
         </div>

         <div>
            <button class="form-submit">Sign Up</button>
         </div>

         <div class="form-link">
            <a href="" class="register-link">Register new user</a>
            <a href="" class="get-password-link">Forgot password?</a>
         </div>
      `;
      mainForm.innerHTML = htmlStr;
   }
};

class formBase {
   constructor() {
      // Create form
      createForm();
      this.initComponents();
      this.displayForm();
      this.handleBlurInput();
   }

   initComponents() {
      //Init validator item
      this.validator = new Validator();
      // Init and handle when click form submission
      this.formSubmitBtn = document.querySelector(".form-submit");
      this.handleSubmitForm();
      // Get all input elements
      this.listInputElements = document.querySelectorAll("input");
   }

   // Function to show error messages
   showHideError(form, errType = ERROR.NO_ERROR) {
      if (form) {
         const formMessage = form.querySelector('.form-message');
         if (!formMessage) {
            return;
         }
         if (errType !== ERROR.NO_ERROR) {
            switch (errType) {
               case ERROR.EMPTY_ERROR:
                  formMessage.innerHTML = 'This field is required';
                  break;
               case ERROR.FORMAT_ERROR:
                  formMessage.innerHTML = 'Invalid format';
                  break;
               case ERROR.NOT_MATCH_ERROR:
                  formMessage.innerHTML = 'Password does not match';
                  break;
               default:
                  break;
            }
         }
         else {
            formMessage.innerHTML = '';
         }
      }
   };

   // Function to display form
   displayForm() {
      // This method is intended to be overridden by subclasses
   }

   // Function to handle when blur input
   handleBlurInput() {
      this.listInputElements.forEach((inputElement) => {
         inputElement.onblur = () => {
            const err = this.validator.validateFormValue(inputElement.value, inputElement.getAttribute('data-type'));
            this.showHideError(inputElement.parentElement, err);
         };
      });
   }

   // Function to handle when submit form
   handleSubmitForm() {
      // This method is intended to be overridden by subclasses
      this.formSubmitBtn.addEventListener("click", (e) => {
         e.preventDefault();
         const [errType, form] = this.validator.validateData();
         this.showHideError(form, errType);
      });
   }
}

class registrationForm extends formBase {
   constructor() {
      super();
   }

   displayForm() {
      // Change button text
      const submitBtn = document.querySelector('.form-submit');
      if (submitBtn) {
         submitBtn.innerHTML = 'Register';
      }

      // Change form title
      const heading = document.querySelector('.heading');
      if (heading) {
         heading.innerHTML = 'Register new user';
      }

      // Hide form link
      const formLink = document.querySelector('.form-link');
      if (formLink) {
         formLink.style.display = 'none';
      }
   }
}

class loginForm extends formBase {
   constructor() {
      super();
      this.handlewhenClickLink();
   }

   displayForm() {
      // Change form title
      const heading = document.querySelector('.heading');
      if (heading) {
         heading.innerHTML = 'Login';
      }

      // Remove email field
      const email = document.querySelector('#email');
      if (email && email.parentElement) {
         email.parentElement.remove();
      }

      // Remove password confirmation field
      const passwordConfirmation = document.querySelector('#password_confirmation');
      if (passwordConfirmation && passwordConfirmation.parentElement) {
         passwordConfirmation.parentElement.remove();
      }

      // Change button text
      const submitBtn = document.querySelector('.form-submit');
      if (submitBtn) {
         submitBtn.innerHTML = 'Login';
      }
   }

   handleSubmitForm() {
      super.handleSubmitForm();
      // Implement logic here
   }

   handlewhenClickLink() {
      const registerLink = document.querySelector('.register-link');
      if (registerLink) {
         registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            const form = new registrationForm();
         });
      }
      const forgotPasswordLink = document.querySelector('.get-password-link');
      if (forgotPasswordLink) {
         forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Implement logic here
         });
      }
   }

}

export const start = (isLogin = true) => {
   if (isLogin) {
      const form = new loginForm();
   }
   else {
      const form = new registrationForm();
   }
};