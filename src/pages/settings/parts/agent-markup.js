import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { API } from "core";

import authStore from "stores/auth-store";
import MarkupFormPart from "parts/markups/markup-form";
import MarkupsListPart from "parts/markups/markups-list";

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
                <MarkupsListPart
                    emptyText={"Agent has no markups"}
                    markups={markups}
                    onRemove={this.remove}
                />
                {!this.state.isExpanded ?
                    <button
                        className="button"
                        onClick={() => this.setState({ isExpanded: true })}
                        style={{ padding: "0 25px", margin: "20px 0 0" }}
                    >
                        Add Markup
                    </button>
                :
                    <MarkupFormPart
                        templates={templates}
                        onSubmit={this.create}
                    />
                }
            </div>
        );
    }
}

export default AgentMarkup;