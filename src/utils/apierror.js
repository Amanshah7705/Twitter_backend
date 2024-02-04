class APIERROR {
  constructor(status, message, error) {
    this.status = status;
    this.message = message;
    this.error = error;
  }
}

export default APIERROR;
