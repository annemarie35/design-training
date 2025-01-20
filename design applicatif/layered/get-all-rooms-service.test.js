import { describe, it, expect } from "vitest";
import { getAllRoomsService } from "./get-all-rooms-service";

describe("getAllRoomsService", () => {
  describe("When user has admin role", () => {
    describe("When the repository returns one room", () => {
      it("should return it", () => {
        // given
        const userRole = "admin";
        const roomsRepositoryDouble = () => {
          return [
            {
              floor: 0,
              number: 1,
              price: 50,
            },
          ];
        };

        // when
        const rooms = getAllRoomsService({
          role: userRole,
          roomsRepository: roomsRepositoryDouble,
        });

        // then
        expect(rooms).toEqual([
          {
            floor: 0,
            number: 1,
            price: 50,
          },
        ]);
      });
    });

    describe("When repository returns empty list", () => {
      it("should return it", () => {
        // given
        const userRole = "admin";
        const roomsRepositoryDouble = () => [];

        // when
        const rooms = getAllRoomsService({
          role: userRole,
          roomsRepository: roomsRepositoryDouble,
        });

        // then
        expect(rooms).toEqual([]);
      });
    });
  });

  describe("When user has not admin role", () => {
    it("should return empty list", () => {
      // given
      const userRole = "member";
      const roomsRepositoryDouble = () => {
        return [
          {
            floor: 0,
            number: 1,
            price: 50,
          },
        ];
      };

      // when
      const rooms = getAllRoomsService({
        role: userRole,
        roomsRepository: roomsRepositoryDouble,
      });

      // then
      expect(rooms).toEqual([]);
    });
  });
});
