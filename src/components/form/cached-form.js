import React from "react";
import { price } from "core";
import { Formik } from "formik";
import UI from "stores/ui-store";

const handleChange = (formName, values) => {
    UI.setFormCache(formName, values);
};

class CachedForm extends React.Component {
    render() {
        var {
            onSubmit = () => {},
            initialValues = {},
            validationSchema,
            render
        } = this.props,
            formName = this.props.id;

        return (
            <Formik
                onSubmit={onSubmit}
                validate={values => handleChange(formName, values)}
                initialValues={UI.getFormCache(formName) || initialValues}
                validationSchema={validationSchema}
                validateOnChange={true}
                render={formik => (
                    <form onSubmit={formik.handleSubmit}>
                        {render(formik)}
                    </form>
                )}
            />
        );
    }
}

export default CachedForm;
