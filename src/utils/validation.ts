export const validateEmail = (email: string) => /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email);

export const validatePassword = (password: string) => password.length >= 6;
