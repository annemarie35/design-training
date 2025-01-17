import { describe, it, expect } from "vitest";
import { updateRoomsPrices } from "../../../src/application/services/update-rooms-price";

describe("UpdateRoomsPrice", () => {
    it("should call repository for each floor with new price", () => {
        let parameters = [];
        // given
        const roomBasePrice = 100;
        const forUpdatingRoomsPricesDouble = ({ floor, roomNewPrice }) => {
            parameters.push({ floor, roomNewPrice });
        };

        // when
        updateRoomsPrices({
            roomBasePrice,
            forUpdatingRoomsPrices: forUpdatingRoomsPricesDouble,
        });

        // expect
        expect(parameters).toEqual([
            { floor: 0, roomNewPrice: 100 },
            { floor: 1, roomNewPrice: 107 },
            { floor: 2, roomNewPrice: 122 },
            { floor: 3, roomNewPrice: 133 },
        ]);
    });
});
