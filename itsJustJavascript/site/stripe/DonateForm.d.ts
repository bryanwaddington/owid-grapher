import * as React from "react";
import Recaptcha from "react-recaptcha";
declare type Interval = "once" | "monthly";
declare enum CurrencyCode {
    USD = "USD",
    GBP = "GBP",
    EUR = "EUR"
}
export declare class DonateForm extends React.Component {
    interval: Interval;
    presetAmount?: number;
    customAmount: string;
    isCustom: boolean;
    name: string;
    showOnList: boolean;
    errorMessage?: string;
    isSubmitting: boolean;
    isLoading: boolean;
    currencyCode: CurrencyCode;
    captchaInstance?: Recaptcha | null;
    captchaPromiseHandlers?: {
        resolve: (value: any) => void;
        reject: (value: any) => void;
    };
    setInterval(interval: Interval): void;
    setPresetAmount(amount?: number): void;
    setCustomAmount(amount: string): void;
    setIsCustom(isCustom: boolean): void;
    setName(name: string): void;
    setShowOnList(showOnList: boolean): void;
    setErrorMessage(message?: string): void;
    setCurrency(currency: CurrencyCode): void;
    get amount(): number | undefined;
    get intervalAmounts(): number[];
    get currencySymbol(): string;
    submitDonation(): Promise<void>;
    getCaptchaToken(): Promise<unknown>;
    onCaptchaLoad(): void;
    onCaptchaVerify(token: string): void;
    onSubmit(event: React.FormEvent): Promise<void>;
    render(): JSX.Element;
}
export declare class DonateFormRunner {
    run(): Promise<void>;
}
export declare function runDonateForm(): void;
export {};
//# sourceMappingURL=DonateForm.d.ts.map