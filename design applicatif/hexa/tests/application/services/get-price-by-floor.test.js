import { describe, it, expect } from "vitest";
import { getPriceByFloor } from "../../../src/application/services/get-price-by-floor";

describe("getPriceByFloor", () => {
  it("should return price for floor 0", () => {
    // given
    const floor = 0;

    // when
    const roomPrice = getPriceByFloor({ floor, roomBasePrice: 100 });

    // then
    expect(roomPrice).toEqual(100);
  });

  it("should return price for floor 1", () => {
    // given
    const floor = 1;

    // when
    const roomPrice = getPriceByFloor({ floor, roomBasePrice: 100 });

    // then
    expect(roomPrice).toEqual(107);
  });

  it("should return price for floor 2", () => {
    // given
    const floor = 2;

    // when
    const roomPrice = getPriceByFloor({ floor, roomBasePrice: 100 });

    // then
    expect(roomPrice).toEqual(122);
  });

  it("should return price for floor 3", () => {
    // given
    const floor = 3;

    // when
    const roomPrice = getPriceByFloor({ floor, roomBasePrice: 100 });

    // then
    expect(roomPrice).toEqual(133);
  });

  it("should not return a price more than 200", () => {
    // given
    const floor = 3;

    // when
    const roomPrice = getPriceByFloor({ floor, roomBasePrice: 300 });

    // then
    expect(roomPrice).toEqual(200);
  });
});
