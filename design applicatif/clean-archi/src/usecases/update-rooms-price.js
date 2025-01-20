import { getPriceByFloor } from "./get-price-by-floor";

export const updateRoomsPrices = ({
    roomBasePrice,
    updateRoomsPricesGateway,
}) => {
    const FLOORS = [0, 1, 2, 3];
    FLOORS.forEach((floor) => {
        const roomNewPrice = getPriceByFloor({ floor, roomBasePrice });
        updateRoomsPricesGateway({ floor, roomNewPrice });
    });
};
