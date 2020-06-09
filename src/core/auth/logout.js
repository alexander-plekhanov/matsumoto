import React from "react";
import Authorize from "./authorize";
import { Loader } from "simple";

class AuthLogoutComponent extends React.PureComponent {

    componentDidMount() {
        Authorize.signoutRedirect();
    }

    render() {
        return <Loader white page />;
    }
}


export default AuthLogoutComponent;



