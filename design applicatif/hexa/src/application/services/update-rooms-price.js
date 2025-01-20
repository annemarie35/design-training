import { getPriceByFloor } from "./get-price-by-floor";

export const updateRoomsPrices = ({
  roomBasePrice,
  forUpdatingRoomsPrices,
}) => {
  const FLOORS = [0, 1, 2, 3];
  FLOORS.forEach((floor) => {
    const roomNewPrice = getPriceByFloor({ floor, roomBasePrice });
    forUpdatingRoomsPrices({ floor, roomNewPrice });
  });
};
