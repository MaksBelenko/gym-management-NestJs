export const NameRegex = /^[^0-9_!¡?÷?¿/\\+=@#%ˆ&*(){}|~<>;:[\]\n$£€¥₹৳]{1,}$/;

export const EmailRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export const JwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;