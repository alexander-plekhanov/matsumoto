import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import UI from "stores/ui-store";
import { localStorage } from "core";
import Authorize from "core/auth/authorize";
import { Link } from "react-router-dom";
import { ReactComponent as NoAvatar } from "./images/no-avatar.svg";
import { Loader } from "components/simple";

const dropdownId = "UserMenuDropdown",
      calcTitleFor = (value) => (value?.length > 14 ? { title: value } : {});

@observer
class UserMenuDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    render() {
        const { t } = useTranslation();

        return (
            <div class="switcher user-switcher"
                 data-dropdown="close"
                 onClick={() => UI.setOpenDropdown(dropdownId)}>
                <div class="avatar">
                    <NoAvatar />
                </div>
                <div class="double">
                    <div class="name" {...calcTitleFor(UI.user?.firstName + UI.user?.lastName)}>{UI.user?.firstName} {UI.user?.lastName}</div>
                    <div class="company" {...calcTitleFor(UI.user?.companies?.[0].name)}>{UI.user?.companies?.[0].name}</div>
                </div>
                <div class="switch-arrow" />
                {dropdownId == UI.openDropdown && <div class="user-menu dropdown">
                    <Link to="/user/booking" class="item">
                        {t("Booking management")}
                    </Link>
                    { (UI.user?.companies?.[0].inCompanyPermissions?.indexOf("ViewCompanyAllPaymentHistory") != -1) &&
                        <Link to="/user/payment-history" class="item">
                            {t("Account statement")}
                        </Link> }
                    { (UI.user?.companies?.[0].inCompanyPermissions?.indexOf("CustomerInvitation") != -1) &&
                        <Link to="/user/invite" class="item">
                            {t("Send invitation")}
                        </Link> }
                    <div class="item" onClick={() => {
                        UI.dropAllFormCaches();
                        Authorize.signoutRedirect().then(this.setState({loading: true}));
                    }}>
                        {t("Log out")}
                    </div>
                </div>}
                { this.state.loading && <Loader page /> }
            </div>
        );
    }
}

export default UserMenuDropdown;
