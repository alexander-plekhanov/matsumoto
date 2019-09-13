import React from 'react';

class FieldCheckbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: !!this.props.value
        };
        this.changing = this.changing.bind(this);
    }

    changing() {
        var { id, formik } = this.props,
            newValue = !this.state.value;

        this.setState({
            value: newValue
        });

        if (formik)
            formik.setFieldValue(id, newValue);
    }

    render() {
        return (
            <div onClick={this.changing} class={"checkbox" + (this.state.value ? ' on' : '')}>
                {this.props.label}
            </div>
        );
    }
}

export default FieldCheckbox;