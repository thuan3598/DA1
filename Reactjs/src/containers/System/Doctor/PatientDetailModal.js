import React, { Component } from 'react';
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';

class PatientDetailModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientInfo: null,
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.patientInfo !== this.props.patientInfo) {
            this.setState({
                patientInfo: this.props.patientInfo,
            });
        }
    }

   
    buildTimeDisplay = (dataTime) => {
        let { language } = this.props;
        if (dataTime && dataTime.timeTypeDataPatient && dataTime.date) {
            let time = language === LANGUAGES.VI
                ? dataTime.timeTypeDataPatient.valueVi
                : dataTime.timeTypeDataPatient.valueEn;

            let date = language === LANGUAGES.VI
                ? moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                : moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY');
            return `${time} - ${date}`;
        }
        return '';
    };

    buildGenderDisplay = (patientData) => {
        let { language } = this.props;
        if (patientData && patientData.genderData) {
            return language === LANGUAGES.VI
                ? patientData.genderData.valueVi
                : patientData.genderData.valueEn;
        }
        return '';
    };

    render() {
        let { isOpen, closePatientDetailModal, language } = this.props;
        let { patientInfo } = this.state;

        // Ensure patientInfo and its nested properties exist before accessing
        if (!patientInfo || !patientInfo.patientData) {
            return null; // Or render a loading/empty state
        }

        let patientData = patientInfo.patientData;
        let timeDisplay = this.buildTimeDisplay(patientInfo);
        let genderDisplay = this.buildGenderDisplay(patientData);

        return (
            <Modal
                isOpen={isOpen}
                toggle={closePatientDetailModal} // Allow closing by backdrop click or escape key
                className={'patient-detail-modal-container'}
                size='lg'
                centered
            >
                <ModalHeader toggle={closePatientDetailModal}>
                    <FormattedMessage id="patient-detail-modal.title" defaultMessage="Thông tin chi tiết bệnh nhân" />
                </ModalHeader>
                <ModalBody>
                    <div className="row detail-info-patient">
                        <div className="col-6 form-group">
                            <label><FormattedMessage id="patient-detail-modal.fullname" defaultMessage="Họ và tên" />:</label>
                            <input className="form-control" type="text" value={patientData.firstName || ''} disabled />
                        </div>
                        <div className="col-6 form-group">
                            <label><FormattedMessage id="patient-detail-modal.email" defaultMessage="Email" />:</label>
                            <input className="form-control" type="text" value={patientData.email || ''} disabled />
                        </div>
                        <div className="col-6 form-group">
                            <label><FormattedMessage id="patient-detail-modal.time" defaultMessage="Thời gian khám" />:</label>
                            <input className="form-control" type="text" value={timeDisplay} disabled />
                        </div>
                        <div className="col-6 form-group">
                            <label><FormattedMessage id="patient-detail-modal.gender" defaultMessage="Giới tính" />:</label>
                            <input className="form-control" type="text" value={genderDisplay} disabled />
                        </div>
                        <div className="col-6 form-group">
                            <label><FormattedMessage id="patient-detail-modal.address" defaultMessage="Địa chỉ" />:</label>
                            <input className="form-control" type="text" value={patientData.address || ''} disabled />
                        </div>
                        <div className="col-6 form-group">
                            <label><FormattedMessage id="patient-detail-modal.phoneNumber" defaultMessage="Số điện thoại" />:</label>
                            <input className="form-control" type="text" value={patientData.phonenumber || ''} disabled />
                        </div>
                        <div className="col-12 form-group">
                            <label><FormattedMessage id="patient-detail-modal.reason" defaultMessage="Lý do khám" />:</label>
                            <textarea className="form-control" rows="3" value={patientInfo.reason || ''} disabled></textarea>
                        </div>
                        {/* You can add more fields if needed, e.g., patientData.birthday */}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={closePatientDetailModal}>
                        <FormattedMessage id="patient-detail-modal.close" defaultMessage="Đóng" />
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PatientDetailModal);
