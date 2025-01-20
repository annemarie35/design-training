class RoomPresenter {
  constructor() {
    this.callsParameters = [];
    this.hasBeenCalled = 0;
  }

  setData = (data) => {
    this.callsParameters.push(data);
    this.hasBeenCalled++;
  };
  calls = () => {
    return {
      callsParameters: this.callsParameters,
      hasBeenCalled: this.hasBeenCalled,
    };
  };
}

export { RoomPresenter };
