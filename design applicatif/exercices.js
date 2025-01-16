export const ROOMSLIST = [
    {
        floor: 0,
        number: 1,
        price: 50,
    },
    {
        floor: 0,
        number: 2,
        price: 50,
    },
    {
        floor: 1,
        number: 101,
        price: 53.5,
    },
    {
        floor: 1,
        number: 102,
        price: 53.5,
    },
    {
        floor: 1,
        number: 103,
        price: 53.5,
    },
    {
        floor: 2,
        number: 201,
        price: 61,
    },
    {
        floor: 2,
        number: 202,
        price: 61,
    },
    {
        floor: 3,
        number: 301,
        price: 66.5,
    },
];

const roomsRepository = () => ROOMSLIST;

export const getAllRoomsService = (role) => {
    if (role !== "admin") {
        return [];
    }
    return roomsRepository();
};
