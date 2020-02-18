import React from "react";
import { plural } from "core";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { FieldText } from "components/form";
import { FieldArray } from "formik";

const
    defaultChildrenAge = 12,
    maximumPeoplePerRoom = 9,
    minimumValuesForSearch = {
        adultsNumber: 1,
        childrenNumber: 0,
        rooms: 1
    },
    setRequestRoomDetails = (formik, current, roomNumber, field, plus, test) => {
        if (!formik)
            return;

        var maximumValuesForSearch = {
            adultsNumber: maximumPeoplePerRoom - formik.values.roomDetails[roomNumber].childrenAges.length,
            childrenNumber: maximumPeoplePerRoom - formik.values.roomDetails[roomNumber].adultsNumber,
            rooms: 5
        };

        if ("rooms" == field)
            current = formik.values.roomDetails.length;

        if ("childrenAges" == field)
            current = formik.values.roomDetails[roomNumber].childrenAges.length;

        const value = current + plus;
        const finalNewValue = Math.min(Math.max(value, minimumValuesForSearch[field]), maximumValuesForSearch[field]);

        if (test)
            return (finalNewValue != current);

        if (!plus)
            return false;

        if ("rooms" == field) {
            if (current < finalNewValue)
                formik.setFieldValue("roomDetails", [...formik.values.roomDetails, {
                    adultsNumber: 2,
                    childrenAges: []
                }]);
            if (current > finalNewValue) {
                var roomDetails = formik.values.roomDetails;
                roomDetails.pop();
                formik.setFieldValue("roomDetails", roomDetails);
            }
        }

        if ("adultsNumber" == field)
            formik.setFieldValue(`roomDetails.${roomNumber}.adultsNumber`, finalNewValue);

        if ("childrenNumber" == field) {
            var childrenAges = formik.values.roomDetails[roomNumber].childrenAges;
            if (current < finalNewValue)
                childrenAges.push(defaultChildrenAge);
            if (current > finalNewValue)
                childrenAges.pop();
            formik.setFieldValue(`roomDetails.${roomNumber}.childrenAges`, childrenAges);
        }
    };

const Row = ({ room, t, text, field, value, formik }) => (
    <div class="row">
        <div class="caption">{t(text)}</div>
        <div
            class={"btn" + (setRequestRoomDetails(formik, value, room, field, -1, "test") ? " enabled" : "")}
            onClick={() => setRequestRoomDetails(formik, value, room, field, -1)}
        >–</div>
        <div class="value">{value}</div>
        <div
            class={"btn" + (setRequestRoomDetails(formik, value, room, field, +1, "test") ? " enabled" : "")}
            onClick={() => setRequestRoomDetails(formik, value, room, field, +1)}
        >+</div>
    </div>
);

@observer
class PeopleDropdown extends React.Component {
    render() {
        var { t } = useTranslation(),
            { formik } = this.props;

        return (
            <div class="people dropdown">
                <Row t={t}
                     formik={formik}
                     room={0}
                     text="Room_plural"
                     field="rooms"
                     value={formik.values.roomDetails.length}
                />

                <FieldArray
                    render={() => (
                        formik.values.roomDetails.map((room, number) => (
                            <React.Fragment>
                                {(formik.values.roomDetails.length > 1) && <h3>Room {number+1} Settings</h3>}
                                <Row t={t}
                                     formik={formik}
                                     room={number}
                                     text="Adult_plural"
                                     field="adultsNumber"
                                     value={room.adultsNumber}
                                />
                                <Row t={t}
                                     formik={formik}
                                     room={number}
                                     text="Children"
                                     field="childrenNumber"
                                     value={room.childrenAges?.length}
                                />
                                {(room.childrenAges?.length > 0) &&
                                    <div class="form">
                                        <h4>{t("Please enter children ages")}</h4>
                                        <div class="row children">
                                            <FieldArray
                                                render={() => (
                                                    room.childrenAges.map((item, r) => (
                                                        <FieldText formik={formik}
                                                            id={`roomDetails.${number}.childrenAges.${r}`}
                                                            placeholder={t("Please enter")}
                                                            suggestion={plural(t, item, "year")}
                                                            numeric
                                                            maxLength={2}
                                                        />
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
    }
}

export default PeopleDropdown;
