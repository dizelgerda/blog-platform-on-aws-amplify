export interface PlainObject {
  [key: string]: string;
}

type AlertType = "success" | "danger" | "warning";

export interface Alert {
  message: string;
  type: AlertType;
}

export interface AmplifyError {
  __type: string;
}
