import React from "react";
import moment from "moment";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { redirect } from "core";
import { CachedForm, FORM_NAMES, FieldText } from "components/form";
import FieldCountry, { searchFormSetDefaultCountries } from "components/complex/field-country";
import FieldDestination from "components/complex/field-destination";
import FieldDatepicker from "components/complex/field-datepicker";
import { accommodationSearchValidator } from "components/form/validation";
import PeopleDropdown from "components/form/dropdown/room-details";
import { searchCreate } from "tasks/accommodation/search-create";
import { countPassengers } from "simple/logic";
import View, { MODALS } from "stores/view-store";
import authStore from "stores/auth-store";

@observer
class AccommodationSearch extends React.Component {
    submit = (values, formik) => {
        View.setOpenDropdown(null);
        if (values.predictionDestination != values.destination)
            formik.setFieldValue("destination", values.predictionDestination);

        if (!authStore.permitted("AccommodationAvailabilitySearch"))
            return View.setModal(MODALS.READ_ONLY);

        searchCreate(values);

        redirect("/search");
    };

    render() {
        var { t } = useTranslation();

        return (
            <div className="search block" style={{paddingBottom: "58px"}}>
                <section>
                    <div className="hide">{JSON.stringify(authStore.settings)}</div>
                    <CachedForm
                        id={ FORM_NAMES.SearchForm }
                        initialValues={{
                            destination: "",
                            residency: "", residencyCode: "",
                            nationality: "", nationalityCode: "",
                            checkInDate: moment().startOf("day"),
                            checkOutDate: moment().startOf("day").add(1, "d"),
                            roomDetails: [
                                {
                                    adultsNumber: 2,
                                    childrenAges: []
                                }
                            ]
                        }}
                        valuesOverwrite={searchFormSetDefaultCountries}
                        validationSchema={accommodationSearchValidator}
                        onSubmit={this.submit}
                        enableReinitialize={true}
                        render={formik => (
                            <>
                                <div className="form">
                                    <div className="row">
                                        <FieldDestination
                                            formik={formik}
                                            id="destination"
                                            label={t("Destination, Hotel Name, Location or Landmark")}
                                            placeholder={t("Choose your Destination, Hotel Name, Location or Landmark")}
                                        />
                                        <FieldDatepicker
                                            formik={formik}
                                            id="dates"
                                            first="checkInDate"
                                            second="checkOutDate"
                                            label={t("Check In - Check Out")}
                                            placeholder={t("Choose date")}
                                        />
                                        <FieldText
                                            formik={formik}
                                            id="room"
                                            label={t("Adults, Children, Rooms")}
                                            placeholder={t("Choose options")}
                                            Icon={<span className="icon icon-arrows-expand"/>}
                                            className="size-medium"
                                            Dropdown={PeopleDropdown}
                                            value={[
                                                __plural(t, countPassengers(formik.values, "adultsNumber"), "Adult"),
                                                __plural(t, countPassengers(formik.values, "childrenNumber"), "Children"),
                                                __plural(t, formik.values.roomDetails.length, "Room")
                                            ].join(" • ")}
                                        />
                                    </div>
                                    <div className="row">
                                        <FieldCountry
                                            formik={formik}
                                            id="nationality"
                                            anotherField="residency"
                                            label={t("Nationality")}
                                            placeholder={t("Choose your nationality")}
                                            className="size-large"
                                            clearable
                                        />
                                        <FieldCountry
                                            formik={formik}
                                            id="residency"
                                            anotherField="nationality"
                                            label={t("Residency")}
                                            placeholder={t("Choose your residency")}
                                            className="size-large"
                                            clearable
                                        />
                                        <div className="field">
                                            <div className="label"/>
                                            <div className="inner">
                                                <button type="submit" className="button">
                                                    {t("Search Accommodations")}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    />
                </section>
            </div>
        );
    }
}

export default AccommodationSearch;
