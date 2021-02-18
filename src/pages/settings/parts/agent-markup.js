import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import {
    CachedForm,
    FieldText,
    FieldSelect
} from "components/form";
import { API } from "core";

import authStore from "stores/auth-store";

@observer
class AgentMarkup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markups: [],
            templates: [],
            isExpanded: false
        }
    }

    componentDidMount() {
        if (!authStore.permitted("MarkupManagement"))
            return null;

        API.get({
            url: API.MARKUP_TEMPLATES,
            success: templates => this.setState({ templates })
        });
        this.load();
    }

    load = () => {
        var { agentId } = this.props;
        API.get({
            url: API.AGENT_MARKUPS(agentId),
            success: markups => this.setState({
                markups,
                isExpanded: !markups?.length
            })
        });
    }

    remove = (id) => {
        var { agentId } = this.props;
        API.delete({
            url: API.AGENT_MARKUP(agentId, id),
            success: () => this.load()
        });
    }

    create = (values, formik) => {
        var { agentId } = this.props,
            { templates } = this.state,
            amount = values.amount;

        amount = amount.replaceAll(",", ".");

        API.post({
            url: API.AGENT_MARKUPS(agentId),
            body: {
                description: values.description,
                templateId: templates[values.templateIndex].id,
                templateSettings: {
                    [templates[values.templateIndex].parameterNames[0]]: amount
                },
                order: values.order,
                currency: "USD"
            },
            success: () => {
                this.load();
                formik.resetForm();
            }
        });
    }

    render() {
        if (!authStore.permitted("MarkupManagement"))
            return null;

        var { t } = useTranslation(),
            { markups, templates } = this.state;

        return (
            <div className="markup-management">
                <h2><span className="brand">{t("Markup Management")}</span></h2>
                {!markups?.length && <div style={{ margin: "30px 0 60px" }}>Agent has no markups</div>}
                {markups
                    .sort((a,b) => (a.settings.order - b.settings.order))
                    .map((markup, index) => (
                    <div className="markup" key={index}>
                        <div>
                            <i>{index + 1}.</i>{" "}
                            <strong>
                                { markup.settings.templateSettings.factor ?
                                    "x " + markup.settings.templateSettings.factor :
                                    "+ " + markup.settings.templateSettings.addition + " USD" }
                            </strong>{" "}
                            ({markup.settings.description}){" "}
                            <i>#{markup.settings.order}</i>
                        </div>
                        <span className="link" onClick={() => this.remove(markup.id)}>Remove</span>
                    </div>
                ))}
                {!this.state.isExpanded ?
                    <button
                        className="button"
                        onClick={() => this.setState({ isExpanded: true })}
                        style={{ padding: "0 25px", margin: "20px 0 0" }}
                    >
                        Add Markup
                    </button>
                :
                    <>
                        <h3>Add Markup</h3>

                        <CachedForm
                            enableReinitialize
                            onSubmit={this.create}
                            initialValues={{
                                templateIndex: 0
                            }}
                            render={formik => (
                                <div className="form">
                                    <FieldSelect formik={formik}
                                                 id="templateIndex"
                                                 label="Markup Type"
                                                 options={
                                                     templates.map((template, index) => (
                                                         {value: index, text: template.title}
                                                     ))
                                                 }
                                    />
                                    <FieldText formik={formik}
                                               id="order"
                                               label="Order"
                                               maxLength={4}
                                               numeric
                                    />
                                    <FieldText formik={formik}
                                               id="description"
                                               label="Description"
                                               placeholder="Description"
                                    />
                                    <FieldText formik={formik}
                                               id="amount"
                                               label="Amount"
                                               placeholder="Amount"
                                    />
                                    <div className="row submit-holder">
                                        <div className="field">
                                            <div className="inner">
                                                <button type="submit" className="button">
                                                    {t("Create Markup")}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                    </>
                }
            </div>
        );
    }
}

export default AgentMarkup;