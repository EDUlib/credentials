import 'babel-polyfill'; // Needed to support Promises on legacy browsers
import React from 'react';
import PropTypes from 'prop-types';
import { Button, CheckBoxGroup, CheckBox, Modal } from '@edx/paragon';

class ShareProgramRecordModal extends React.Component {
  constructor(props) {
    super(props);
    this.sendRecord = this.sendRecord.bind(this);
    this.updateState = this.updateState.bind(this);
    this.state = {
      RIT: false,
      MIT: false,
    };
  }

  getCheckedOrganizations() {
    const organizations = [];

    if (this.state.RIT) { organizations.push('RIT'); }
    if (this.state.MIT) { organizations.push('MIT'); }
    return organizations;
  }

  updateState(checked, name) {
    this.setState({
      [name]: !this.state[name],
    });
  }

  sendRecord() {
    this.setState({
      recordSent: true,
    });
  }

  render() {
    const { onClose, parentSelector, uuid } = this.props;

    return (
      <Modal
        title={gettext('Send to edX Credit Partner')}
        {...(parentSelector && { parentSelector })}
        onClose={onClose}
        body={(
          <div>
            <p>{ gettext('You can directly share your program record with an edX partner that accepts credit transfer for this MicroMasters Program. Once you send your record you cannot unsend it.') }</p>
            <p>{ gettext('Select organization(s) you wish to send this record to:') }</p>
            <CheckBoxGroup>
              <CheckBox
                id="checkbox1"
                name="RIT"
                label="RIT"
                onChange={this.updateState}
                checked={this.state.RIT}
              />
              <CheckBox
                id="checkbox2"
                name="MIT"
                label="MIT"
                onChange={this.updateState}
                checked={this.state.MIT}
              />
            </CheckBoxGroup>
          </div>
        )}
        open
        buttons={[
          <Button
            label={gettext('Send')}
            buttonType="primary"
            onClick={(event) => {
              this.sendRecord(event); window.edx.analytics.handleClick(event);
            }}
            data-track-type="click"
            data-track-event="edx.bi.credentials.program_record.send_finished"
            data-track-event-property-category="records"
            data-track-event-property-program-uuid={uuid}
            data-track-event-property-organizations={this.getCheckedOrganizations()}
          />,
        ]}
      />
    );
  }
}

ShareProgramRecordModal.propTypes = {
  onClose: PropTypes.func,
  parentSelector: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  uuid: PropTypes.string,
};

ShareProgramRecordModal.defaultProps = {
  onClose: () => {},
  parentSelector: false,
  uuid: '',
};

export default ShareProgramRecordModal;
