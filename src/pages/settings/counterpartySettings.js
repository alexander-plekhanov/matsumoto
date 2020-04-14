import React from "react";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { API } from "core";

import UsersPagesHeader from "components/usersPagesHeader";
import { FieldText, FieldTextarea } from "components/form";
import { Loader } from "components/simple";

import CounterpartyStore from "stores/counterparty-store";
import AuthStore from "stores/auth-store";

@observer
export default class CounterpartySettings extends React.Component {
    componentDidMount() {
        API.get({
            url: API.COUNTERPARTY_INFO(AuthStore.activeCounterparty.id),
            success: (result) =>
                CounterpartyStore.setCounterparty(result)
        });
    }
    render() {
        const { t } = useTranslation();
        const {
            counterpartySettings: {
                name,
                address,
                countryCode,
                city,
                phone,
                fax,
                postalCode,
                preferredCurrency,
                preferredPaymentMethod,
                website,
                email,
            },
            isLoadingCounterpartySettings,
        } = CounterpartyStore;

        return <>
            <UsersPagesHeader />
            {isLoadingCounterpartySettings && <Loader />}
            {!isLoadingCounterpartySettings && <section className="medium-section">
                <Formik
                    render={formik => <div className="form">
                        <h2 className="users-pages__title">{t("MY ACCOUNT SUPERVISOR")}</h2>
                        <div className="row">
                            <FieldText formik={formik}
                                       id="preferredPaymentMethod"
                                       label={t("Payment method")}
                                       placeholder={t("Payment method")}
                                       value={preferredPaymentMethod}
                                       disabled
                            />
                            <FieldText formik={formik}
                                       id="currency"
                                       label={t("Currency")}
                                       placeholder={t("Currency")}
                                       value={preferredCurrency}
                                       disabled
                            />
                        </div>
                        {/*<div className="row">*/}
                        {/*    <FieldText formik={formik}*/}
                        {/*               id="creditLimit"*/}
                        {/*               label={t("Credit Limit")}*/}
                        {/*               placeholder={t("Credit Limit")}*/}
                        {/*               disabled*/}
                        {/*    />*/}
                        {/*    <FieldText formik={formik}*/}
                        {/*               id="availableCredit"*/}
                        {/*               label={t("Available Credit")}*/}
                        {/*               placeholder={t("Available Credit")}*/}
                        {/*               disabled*/}
                        {/*    />*/}
                        {/*</div>*/}
                        {/*<div className="row">*/}
                        {/*    <FieldText formik={formik}*/}
                        {/*               id="signDate"*/}
                        {/*               label={t("Sign Date")}*/}
                        {/*               placeholder={t("Sign Date")}*/}
                        {/*               disabled*/}
                        {/*    />*/}
                        {/*    <FieldText formik={formik}*/}
                        {/*               id="agency"*/}
                        {/*               label={t("Agency")}*/}
                        {/*               placeholder={t("Agency")}*/}
                        {/*               disabled*/}
                        {/*    />*/}
                        {/*</div>*/}
                        <div className="row">
                            <FieldText formik={formik}
                                       id="phone"
                                       label={t("Telephone")}
                                       placeholder={t("Telephone")}
                                       value={phone}
                                       disabled
                            />
                            <FieldText formik={formik}
                                       id="fax"
                                       label={t("Fax")}
                                       placeholder={t("Fax")}
                                       value={fax}
                                       disabled
                            />
                        </div>

                        <h2 className="users-pages__title">{t("VOUCHER PERSONALISATION")}</h2>

                        <div className="row">
                            <FieldText formik={formik}
                                       id="counterpartyName"
                                       label={t("Company Name")}
                                       placeholder={t("Company Name")}
                                       value={name}
                                       disabled
                            />
                        </div>
                        <div className="row">
                            <FieldText formik={formik}
                                       id="country"
                                       label={t("Country")}
                                       placeholder={t("Country")}
                                       value={countryCode}
                                       disabled
                            />
                            <FieldText formik={formik}
                                       id="city"
                                       label={t("City")}
                                       placeholder={t("City")}
                                       value={city}
                                       disabled
                            />
                        </div>
                        <div className="row">
                            <FieldText formik={formik}
                                       id="zipCode"
                                       label={t("Zip/Postal Code")}
                                       placeholder={t("Zip/Postal Code")}
                                       value={postalCode}
                                       disabled
                            />
                            <FieldText formik={formik}
                                       id="website"
                                       label={t("Website")}
                                       placeholder={t("Website")}
                                       value={website}
                                       disabled
                            />
                        </div>
                        <div className="row">
                            <FieldTextarea
                                formik={formik}
                                id="address"
                                label={t("Address")}
                                placeholder={t("Address")}
                                value={address}
                                disabled
                            />
                        </div>
                    </div>}
                />
            </section>}
        </>
    }
}