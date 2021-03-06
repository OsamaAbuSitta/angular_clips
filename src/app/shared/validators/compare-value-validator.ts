import { ValidationErrors, AbstractControl, ValidatorFn } from "@angular/forms";

export class CompareValueValidator {
    static match(controlName: string, matchingControlName: string, errorMessage: string = ''): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const control = group.get(controlName);
            const matchingControl = group.get(matchingControlName);

            if (!control || !matchingControl){
                console.error('Form control can not be found in the form group !!');
                return { controlNotFound: false };
            }

            if (control.value !== matchingControl.value)
                matchingControl.setErrors({ noMatch: errorMessage })

            return null;
        }
    }
}
