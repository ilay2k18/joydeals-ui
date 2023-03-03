import { FormControl, ValidationErrors } from "@angular/forms";
import { ValidationError } from "webpack";

export class JoyDealsValidators {
    // whitespace validator
    static notOnlyWhitespace(control: FormControl): ValidationErrors {

        if ((control.value != null) && (control.value.trim().length === 0)) {
            // invalid , return error object
            return { 'notOnlyWhitespace': true };
        }
        else {
            return null as any;
        }
    }
}
