import {parsePhoneNumberFromString,type CountryCode} from 'libphonenumber-js';
export function normalizePhone(value:string,country:CountryCode){
  const phone=parsePhoneNumberFromString(value,country);
  if(!phone?.isValid())throw new Error('Enter a valid phone number, including its country code.');
  return phone.number;
}
export function authError(error:unknown){
  const code=(error as {code?:string})?.code;
  const messages:Record<string,string>={
    'auth/popup-closed-by-user':'Google sign-in was closed. Please try again when you are ready.',
    'auth/popup-blocked':'This browser blocked the sign-in window. Allow popups or use email sign-in.',
    'auth/cancelled-popup-request':'A Google sign-in window is already open.',
    'auth/unauthorized-domain':'Sign-in is not enabled for this website address yet.',
    'auth/operation-not-allowed':'This sign-in method is not enabled yet. Please choose another method.',
    'auth/invalid-credential':'The email or password is incorrect. Please try again.',
    'auth/email-already-in-use':'An account already uses this email. Log in or reset your password.',
    'auth/weak-password':'Use a stronger password with at least 8 characters.',
    'auth/too-many-requests':'Too many attempts. Please wait before trying again.',
    'auth/quota-exceeded':'SMS verification is temporarily unavailable. Please use Google or email.',
    'auth/invalid-verification-code':'That code is incorrect. Check your SMS and try again.',
    'auth/code-expired':'This code expired. Request a new SMS code.',
    'auth/session-expired':'This verification session expired. Request a new code.',
    'auth/captcha-check-failed':'The security check expired. Please try sending the code again.',
    'auth/invalid-phone-number':'Please enter a valid phone number.',
    'auth/network-request-failed':'We could not connect. Check your connection and try again.',
    'auth/account-exists-with-different-credential':'Use your existing sign-in method for this email.',
    'auth/user-disabled':'This account is disabled. Contact the service operator.',
    'auth/invalid-app-credential':'Phone verification is not configured for this domain yet.',
  };
  return messages[code??'']??(code?'Sign-in could not finish. Please retry or use another method.':(error as Error)?.message??'Please try again.');
}
