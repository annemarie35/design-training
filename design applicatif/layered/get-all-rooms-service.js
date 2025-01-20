export const getAllRoomsService = ({ role, roomsRepository }) => {
  if (role !== "admin") {
    return [];
  }
  return roomsRepository();
};
