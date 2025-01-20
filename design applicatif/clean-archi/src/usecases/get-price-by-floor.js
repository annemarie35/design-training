export const getPriceByFloor = ({ floor, roomBasePrice = 100 }) => {
    const floorRates = {
        0: 0,
        1: 7,
        2: 22,
        3: 33,
    };
    const roomPrice = roomBasePrice + (roomBasePrice * floorRates[floor]) / 100;
    return roomPrice > 200 ? 200 : roomPrice;
};
