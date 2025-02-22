export const INPUT_TYPE = {
   PHONE_NUMBER: "phonenumber",
   USER_NAME: "username",
   USER_EMAIL: "useremail",
   USER_PASSWORD: "userpassword",
   USER_PASSWORD_CONFIRMATION: "userpasswordconfirmation",
};

const NAME_ERROR = {
   NO_ERROR: 0,
   NAME_EMPTY_ERROR: 1,
};

const EMAIL_ERROR = {
   NO_ERROR: 0,
   EMAIL_EMPTY_ERROR: 1,
   EMAIL_FORMAT_ERROR: 2,
}

export const ERROR = {
   NO_ERROR: 0,
   EMPTY_ERROR: 1,
   FORMAT_ERROR: 2,
   NOT_MATCH_ERROR: 3,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Validator class to handle form validation
class Validator {
   constructor() {
   }
   // Function to validate form values based on input type
   validateFormValue(value = '', type = INPUT_TYPE.USER_NAME) {
      if (value === '' || value === null || value === undefined) {
         return ERROR.EMPTY_ERROR;
      }
      let errType = ERROR.NO_ERROR;
      const passwordEle = document.querySelector(`input[data-type=${INPUT_TYPE.USER_PASSWORD}]`);
      switch (type) {
         case INPUT_TYPE.USER_EMAIL:
            if (!EMAIL_REGEX.test(value)) {
               errType = ERROR.FORMAT_ERROR;
            }
            break;
         case INPUT_TYPE.USER_PASSWORD:
            if (!PASSWORD_REGEX.test(value)) {
               errType = ERROR.FORMAT_ERROR;
            }
            break;
         case INPUT_TYPE.USER_PASSWORD_CONFIRMATION:
            if (passwordEle && passwordEle.value !== value) {
               errType = ERROR.NOT_MATCH_ERROR;
            }
            break;
         case INPUT_TYPE.USER_NAME:
         default:
            break;
      }
      return errType;
   };

   // Function to validate a single form
   validateForm(form) {
      let errType = ERROR.NO_ERROR;
      if (form) {
         let inputElement = form.querySelector("input");
         if (inputElement) {
            errType = this.validateFormValue(inputElement.value, inputElement.getAttribute('data-type'));
            if (errType !== ERROR.NO_ERROR) {
               return errType;
            }
         }
      }
      return errType;
   };

   // Function to validate all form data
   validateData() {
      const listInputElements = document.querySelectorAll(".form-group");
      if (listInputElements) {
         for (let i = 0; i < listInputElements.length; i++) {
            const form = listInputElements[i];
            const err = this.validateForm(form);
            if (err !== ERROR.NO_ERROR) {
               return [err, form];
            }
         }
      }
      return [ERROR.NO_ERROR, undefined];
   };
}

export default Validator; 