import { ValidationErrors,AbstractControl, ValidatorFn } from "@angular/forms";

export class CompareValueValidator {
    static match(controlName:string , matchingControlName:string) : ValidatorFn
    {
        return (group:AbstractControl): ValidationErrors | null => {
            const control = group.get(controlName);
            const matchingControl = group.get(matchingControlName);
    
            if(!control || !matchingControl)
                return {controlNotFound:false};
    
            if(control.value !== matchingControl.value)
              return {noMatch:true}
    
    
            return null;


        }
        
    }
}
