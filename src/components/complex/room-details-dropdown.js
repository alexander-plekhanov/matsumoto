import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { FieldText } from "components/form";
import { FieldArray } from "formik";
import { MODALS } from "enum/modals-enum";
import { $view } from "stores";

const
    MAXIMUM_PEOPLE_PER_REQUEST = 9,
    MAXIMUM_ROOMS_PER_REQUEST = 5,
    DEFAULT_ROOM_ADULTS = 1,
    MINIMUM_VALUES = {
        adultsNumber: 1,
        childrenNumber: 0,
        rooms: 1
    },
    setRequestRoomDetails = (formik, current, roomNumber, field, plus, test) => {
        if (!formik)
            return;

        let currentRooms = formik.values.roomDetails.length,
            currentPeopleInAnotherRooms = formik.values.roomDetails?.reduce((acc, currentValue, index) => {
                if ("rooms" != field && roomNumber == index)
                    return acc;
                return acc + currentValue.adultsNumber + currentValue.childrenAges.length;
            }, 0),
            maximumValuesForOneRoom = {
                adultsNumber: MAXIMUM_PEOPLE_PER_REQUEST - currentPeopleInAnotherRooms - formik.values.roomDetails[roomNumber].childrenAges.length,
                childrenNumber: MAXIMUM_PEOPLE_PER_REQUEST - currentPeopleInAnotherRooms - formik.values.roomDetails[roomNumber].adultsNumber,
                rooms: currentPeopleInAnotherRooms < MAXIMUM_PEOPLE_PER_REQUEST ? MAXIMUM_ROOMS_PER_REQUEST : currentRooms
            },
            currentPeople = currentPeopleInAnotherRooms + formik.values.roomDetails[roomNumber].childrenAges.length + formik.values.roomDetails[roomNumber].adultsNumber;

        if ("rooms" == field)
            current = currentRooms;

        if ("childrenAges" == field)
            current = formik.values.roomDetails[roomNumber].childrenAges.length;

        const value = current + plus;
        const finalNewValue = Math.min(Math.max(value, MINIMUM_VALUES[field]), maximumValuesForOneRoom[field]);

        if (test)
            return (finalNewValue != current);

        if (finalNewValue == current && (
            ("rooms" == field && currentRooms == MAXIMUM_ROOMS_PER_REQUEST) ||
            ("rooms" != field && currentPeople == MAXIMUM_PEOPLE_PER_REQUEST)
        )) {
            $view.setModal(MODALS.SEARCH_OVERLOAD);
            return;
        }

        if ("rooms" == field) {
            if (current < finalNewValue)
                formik.setFieldValue("roomDetails", [...formik.values.roomDetails, {
                    adultsNumber: currentPeopleInAnotherRooms <= MAXIMUM_PEOPLE_PER_REQUEST - DEFAULT_ROOM_ADULTS ? DEFAULT_ROOM_ADULTS : MINIMUM_VALUES.adultsNumber,
                    childrenAges: []
                }]);
            if (current > finalNewValue) {
                let roomDetails = formik.values.roomDetails;
                roomDetails.pop();
                formik.setFieldValue("roomDetails", roomDetails);
            }
        }

        if ("adultsNumber" == field)
            formik.setFieldValue(`roomDetails.${roomNumber}.adultsNumber`, finalNewValue);

        if ("childrenNumber" == field) {
            let childrenAges = formik.values.roomDetails[roomNumber].childrenAges;
            if (current < finalNewValue)
                childrenAges.push(null);
            if (current > finalNewValue)
                childrenAges.pop();
            formik.setFieldValue(`roomDetails.${roomNumber}.childrenAges`, childrenAges);
        }
    };

const Row = ({ room, text, field, value, formik }) => {
    const { t } = useTranslation();
    return (
        <div className="row">
            <div className="caption">{t(text)}</div>
            <div
                className={"btn" + __class(setRequestRoomDetails(formik, value, room, field, -1, "test"), "enabled")}
                onClick={() => setRequestRoomDetails(formik, value, room, field, -1)}
            >???</div>
            <div className="value">{value}</div>
            <div
                className={"btn" + __class(setRequestRoomDetails(formik, value, room, field, +1, "test"), "enabled")}
                onClick={() => setRequestRoomDetails(formik, value, room, field, +1)}
            >+</div>
        </div>
    );
};

const RoomDetailsDropdown = observer(({ formik }) => {
    const { t } = useTranslation();

    return (
        <div className="room-details dropdown">
            <Row
                 formik={formik}
                 room={0}
                 text="Room_plural"
                 field="rooms"
                 value={formik.values.roomDetails.length}
            />

            <FieldArray
                render={() => (
                    formik.values.roomDetails.map((room, number) => (
                        <React.Fragment key={number}>
                            {(formik.values.roomDetails.length > 1) && <h3>Room {number+1} Settings</h3>}
                            <Row
                                 formik={formik}
                                 room={number}
                                 text="Adult_plural"
                                 field="adultsNumber"
                                 value={room.adultsNumber}
                            />
                            <Row
                                 formik={formik}
                                 room={number}
                                 text="Children"
                                 field="childrenNumber"
                                 value={room.childrenAges?.length}
                            />
                            {(room.childrenAges?.length > 0) &&
                                <div className="form">
                                    <h4>{t("Please enter children ages")}</h4>
                                    <div className="row children">
                                        <FieldArray
                                            render={() => (
                                                room.childrenAges.map((item, r) => (
                                                    <div className="part" key={r}>
                                                        <FieldText formik={formik}
                                                            id={`roomDetails.${number}.childrenAges.${r}`}
                                                            placeholder="12"
                                                            maxLength={2}
                                                            numeric
                                                        />
                                                        <div
                                                            className="btn enabled"
                                                            onClick={() => formik.setFieldValue(
                                                                `roomDetails.${number}.childrenAges.${r}`,
                                                                Math.max(0, (formik.values["roomDetails"][number]["childrenAges"][r] || 12) - 1) + ""
                                                            )}
                                                        >???</div>
                                                        <div
                                                            className="btn enabled"
                                                            onClick={() => formik.setFieldValue(
                                                                `roomDetails.${number}.childrenAges.${r}`,
                                                                parseInt(formik.values["roomDetails"][number]["childrenAges"][r] || 12) + 1
                                                            )}
                                                        >+</div>
                                                    </div>
                                                ))
                                            )}
                                        />
                                    </div>
                                </div>
                            }
                        </React.Fragment>
                    ))
                )}
            />
        </div>
    );
});

export default RoomDetailsDropdown;
