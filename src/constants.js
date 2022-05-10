const Constants = {
    backgroundColor: "#2f2f2f",
    fieldColor: "#2c2c2c",
    fieldBorderColor: "#3e3e3e",
    noSignalColor: "#1c2028",
    noSignalSelectedColor: "#252629",
    signalColor: "#e81e32",
    signalSelectedColor: "#e84d5c",
    IOColor: "#1c2028",
    componentsBackgroundColor: "#1f1f1f",
    elementsColor: "#5e24b5",
    elementsSelectedColor: "#7448b5",
    notElementsColor: "#891f1b",
    notElementsSelectedColor: "#8a3a37",
    andElementsColor: "#29739e",
    andElementsSelectedColor: "#497f9e",
    orElementsColor: "#8d4da4",
    orElementsSelectedColor: "#956da3",
    xorElementsColor: "#bb3a78",
    xorElementsSelectedColor: "#ba5f8b",

    fieldBeginX: 40,
    fieldEndX: window.innerWidth - 40,
    fieldBeginY: 20,
    fieldEndY: window.innerHeight - 80,
    fieldWidth: 0,
    fieldHeight: 0,

    FieldIOSize: 40,
    GateIOSize: 25,

    GateIOElementsMargin: 10,
    distanceBetweenFieldIOElements: 20,

    plusInputX: 3,
    plusInputY: 20,
    minusInputX: 3,
    minusInputY: 70,
    plusOutputX: window.innerWidth - 40 + 6,
    plusOutputY: 20,
    minusOutputX: window.innerWidth - 40 + 6,
    minusOutputY: 70,
    buttonSize: 30

}

Constants.fieldWidth = Constants.fieldEndX - Constants.fieldBeginX;
Constants.fieldHeight = Constants.fieldEndY - Constants.fieldBeginY;

export default Constants;