// declare global {
//     interface String {
//       capitalise(): string;
//     }
//   }

//   String.prototype.capitalise = function() {
//     let s = String(this)
//     if (typeof s !== 'string') 
//         return '';
    
//     return s.charAt(0).toUpperCase() + s.slice(1);
//   };
  
//   export {}

declare global {
    interface StringConstructor {
        capitalise(s: string): string;
    }
  }
  
String.capitalise = (s: string) => {
    // let s = String(this)
    if (typeof s !== 'string') 
        return '';
    
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  
  export {}