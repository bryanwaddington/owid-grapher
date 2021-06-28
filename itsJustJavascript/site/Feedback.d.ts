import React from "react";
declare class Feedback {
    name: string;
    email: string;
    message: string;
    environment: string;
    clear(): void;
}
export declare class FeedbackForm extends React.Component<{
    onClose?: () => void;
    autofocus?: boolean;
}> {
    feedback: Feedback;
    loading: boolean;
    done: boolean;
    error: string | undefined;
    submit(): Promise<void>;
    onSubmit(e: React.FormEvent<HTMLFormElement>): void;
    onName(e: React.ChangeEvent<HTMLInputElement>): void;
    onEmail(e: React.ChangeEvent<HTMLInputElement>): void;
    onMessage(e: React.ChangeEvent<HTMLTextAreaElement>): void;
    onClose(): void;
    renderBody(): JSX.Element;
    render(): JSX.Element;
}
export declare class FeedbackPrompt extends React.Component {
    isOpen: boolean;
    toggleOpen(): void;
    onClose(): void;
    onClickOutside(): void;
    render(): JSX.Element;
}
export declare function runFeedbackPage(): void;
export {};
//# sourceMappingURL=Feedback.d.ts.map