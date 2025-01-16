import { describe, it, expect } from "vitest";
import { getAllRooms, ROOMSLIST } from "./exercices";

describe("getAllRooms", () => {
    describe("When user has admin role", () => {
        it("should return all rooms", () => {
            const rooms = getAllRooms("admin");
            expect(rooms).toEqual(ROOMSLIST);
        });
    });

    describe("When user has not admin role", () => {
        it("should return all rooms", () => {
            const rooms = getAllRooms("member");
            expect(rooms).toEqual([]);
        });
    });
});
