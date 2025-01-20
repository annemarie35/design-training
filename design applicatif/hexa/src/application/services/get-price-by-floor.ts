export const getPriceByFloor = ({
  floor,
  roomBasePrice = 100,
}: PriceByFloor): number => {
  const MAX_ROOM_PRICE = 200;
  const floorRates: RatesByFloor = {
    0: 0,
    1: 7,
    2: 22,
    3: 33,
  };
  const roomPrice: number =
    roomBasePrice + (roomBasePrice * floorRates[floor]) / 100;
  return roomPrice > MAX_ROOM_PRICE ? MAX_ROOM_PRICE : roomPrice;
};

type PriceByFloor = {
  floor: Floor;
  roomBasePrice: number;
};

type Floor = 0 | 1 | 2 | 3;

type RatesByFloor = Record<Floor, number>;
