import { describe, it, expect } from "vitest";
import { getAllRoomsUsecase } from "../../src/usecases/get-all-rooms-usecase";
import { RoomPresenter } from "./RoomPresenter";

describe("getAllRoomsUseCase", () => {
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
                const roomsPresenterDouble = new RoomPresenter();

                // when
                getAllRoomsUsecase({
                    role: userRole,
                    roomsRepository: roomsRepositoryDouble,
                    roomsPresenter: roomsPresenterDouble,
                });

                // then
                const actual = roomsPresenterDouble.calls();
                expect(actual.hasBeenCalled).toEqual(1);
                expect(actual.callsParameters).toEqual([
                    [
                        {
                            floor: 0,
                            number: 1,
                            price: 50,
                        },
                    ],
                ]);
            });
        });

        describe("When repository returns empty list", () => {
            it("should return it", () => {
                // given
                const userRole = "admin";
                const roomsRepositoryDouble = () => [];
                const roomsPresenterDouble = new RoomPresenter();

                // when
                getAllRoomsUsecase({
                    role: userRole,
                    roomsRepository: roomsRepositoryDouble,
                    roomsPresenter: roomsPresenterDouble,
                });

                // then
                const actual = roomsPresenterDouble.calls();
                expect(actual.hasBeenCalled).toEqual(1);
                expect(actual.callsParameters).toEqual([[]]);
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
            const roomsPresenterDouble = new RoomPresenter();

            // when
            getAllRoomsUsecase({
                role: userRole,
                roomsRepository: roomsRepositoryDouble,
                roomsPresenter: roomsPresenterDouble,
            });

            // then
            const actual = roomsPresenterDouble.calls();
            expect(actual.hasBeenCalled).toEqual(1);
            expect(actual.callsParameters).toEqual([[]]);
        });
    });
});
