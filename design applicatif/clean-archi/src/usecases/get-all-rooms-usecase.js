export const getAllRoomsUsecase = ({
    role,
    roomsRepository,
    roomsPresenter,
}) => {
    if (role !== "admin") {
        roomsPresenter.setData([]);
        return;
    }
    const rooms = roomsRepository();
    roomsPresenter.setData(rooms);
};
