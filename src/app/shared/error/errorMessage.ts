import { Component } from '@angular/core';
@Component({
    selector: 'app-error-message',
    templateUrl: './errorMessage.html',
})
export class ErrorMessageComponent {
    private ErrorMsg: string;
    public ErrorMessageIsVisible: boolean;

    public showErrorMessage(msg: string) {
        this.ErrorMsg = msg;
        this.ErrorMessageIsVisible = true;
    }

    public hideErrorMsg() {
        this.ErrorMessageIsVisible = false;
    }
}