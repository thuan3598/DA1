import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManagePatient.scss";
import { LANGUAGES } from "../../../utils";
import DatePicker from "../../../components/Input/DatePicker";
import { FormattedMessage } from "react-intl";
import {
  getListPatientForDoctorService,
  sendRemedyService,
  getAllCodeService,
  cancelPatientService,
} from "../../../services/userService";
import moment from "moment";
import RemedyModal from "./RemedyModal";
import PatientDetailModal from "./PatientDetailModal"; // <-- Import modal mới
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import _ from "lodash";

import chatIcon from "../../../assets/email.png";

class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataPatient: [],
      isOpenRemedyModal: false,
      dataModal: {},
      isShowLoading: false,
      listStatus: [],
      isOpenPatientDetailModal: false, 
      selectedPatientData: null, 
    };
  }

  async componentDidMount() {
    await this.getDataPatient();
  }

  getDataPatient = async () => {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formatedDate = new Date(currentDate).getTime();
    let res = await getListPatientForDoctorService({
      doctorId: user.id,
      date: formatedDate,
      statusId: "ALL",
    });

    console.log("patient array: ", res);

    let resStatus = await getAllCodeService("STATUS");

    if (res && res.errCode === 0 && resStatus && resStatus.errCode === 0) {
      let dataStatus = resStatus.data;

      if (dataStatus && dataStatus.length > 0) {
        dataStatus.unshift({
          createdAt: null,
          keyMap: "ALL",
          type: "STATUS",
          valueEn: "All",
          valueVi: "Tất cả",
        });
      }

      this.setState({
        dataPatient: res.data,
        listStatus: dataStatus ? dataStatus : [],
      });
    }
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  handleOnchangeDatePicker = (date) => {
    this.setState(
      {
        currentDate: date[0],
      },
      async () => {
        await this.getDataPatient();
      }
    );
  };

  handleBtnConfirm = (item) => {
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      patientEmail: item.patientData.email,
      patientName: item.patientData.firstName,
      timeType: item.timeType,
    };
    this.setState({
      isOpenRemedyModal: true,
      dataModal: data,
    });
  };

  handleBtnCancel = async (item) => {
    let res = await cancelPatientService({
      doctorId: item.doctorId,
      patientId: item.patientId,
    });
    if (res && res.errCode === 0) {
      toast.success("Cancel appointment succeed!");
      await this.getDataPatient();
    } else {
      toast.error("Cancel appointment failed!");
    }
  };

  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
      dataModal: {},
    });
  };

  sendRemedy = async (dataChild) => {
    let { dataModal } = this.state;
    this.setState({
      isShowLoading: true,
    });

    let res = await sendRemedyService({
      email: dataChild.email,
      imageBase64: dataChild.imgBase64,
      doctorId: dataModal.doctorId,
      patientId: dataModal.patientId,
      timeType: dataModal.timeType,
      language: this.props.language,
      patientName: dataModal.patientName,
    });
    if (res && res.errCode === 0) {
      this.setState({
        isShowLoading: false,
      });
      toast.success("Send remedy succeed!");
      this.closeRemedyModal();
      await this.getDataPatient();
    } else {
      this.setState({
        isShowLoading: false,
      });
      toast.error("Send remedy failed!");
    }
  };

  handleOnChangeSelect = async (event) => {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formatedDate = new Date(currentDate).getTime();
    let res = await getListPatientForDoctorService({
      doctorId: user.id,
      date: formatedDate,
      statusId: event.target.value,
    });

    console.log("patient array: ", res);

    if (res && res.errCode === 0) {
      let data = res.data;
      this.setState({
        dataPatient: data,
      });
    }
  };

  handleViewMessage = () => {
    if (this.props.history) {
      this.props.history.push('/home');
      this.props.history.replace(`/chat-app`);
    }
  };

  
  handleViewPatientDetail = (patientItem) => {
    this.setState({
      isOpenPatientDetailModal: true,
      selectedPatientData: patientItem, 
    });
  };

 
  closePatientDetailModal = () => {
    this.setState({
      isOpenPatientDetailModal: false,
      selectedPatientData: null,
    });
  };

  render() {
    let { dataPatient, isOpenRemedyModal, dataModal, listStatus, isOpenPatientDetailModal, selectedPatientData } = this.state; // <-- Lấy state mới
    let { language } = this.props;
    return (
      <>
        <div
          className="chat-button"
          onClick={() => this.handleViewMessage()}
        >
          <img src={chatIcon} alt="Chat Icon" className="chat-icon-img" />
        </div>
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner
          text="Loading..."
        >
          <div className="manage-patient-container">
            <div className="m-p-title">
              <FormattedMessage id="admin.manage-patient.title" />
            </div>
            <div className="manage-patient-body row">
              <div className="col-4 form-group">
                <label>
                  <FormattedMessage id="admin.manage-patient.chose-date" />
                </label>
                <DatePicker
                  onChange={this.handleOnchangeDatePicker}
                  className="form-control"
                  value={this.state.currentDate}
                />
              </div>
              <div className="col-2 form-group select-cus">
                <label>
                  <FormattedMessage id="admin.manage-patient.chose-status" />
                </label>
                <select onChange={(event) => this.handleOnChangeSelect(event)}>
                  {listStatus &&
                    listStatus.length > 0 &&
                    listStatus.map((item, index) => {
                      return (
                        <option key={index} value={item.keyMap}>
                          {language === LANGUAGES.VI
                            ? item.valueVi
                            : item.valueEn}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="col-12 table-manage-patient">
                <table id="customers">
                  <tbody>
                    <tr>
                      <th>
                        <FormattedMessage id="manage-user.numeric" />
                      </th>
                      <th>Email</th>
                      <th>
                        <FormattedMessage id="manage-user.time" />
                      </th>
                      <th>
                        <FormattedMessage id="manage-user.name" />
                      </th>
                      <th>
                        <FormattedMessage id="manage-user.gender" />
                      </th>
                      <th>
                        <FormattedMessage id="manage-user.address" />
                      </th>
                      <th>
                        <FormattedMessage id="manage-user.status" />
                      </th>
                      <th>
                        <FormattedMessage id="manage-user.action" />
                      </th>
                    </tr>
                    {dataPatient && dataPatient.length > 0 ? (
                      dataPatient.map((item, index) => {
                        let time =
                          language === LANGUAGES.VI
                            ? item.timeTypeDataPatient.valueVi
                            : item.timeTypeDataPatient.valueEn;
                        let gender =
                          language === LANGUAGES.VI
                            ? item.patientData.genderData.valueVi
                            : item.patientData.genderData.valueEn;
                        let statusCheck =
                          language === LANGUAGES.VI
                            ? item.statusTypeDataPatient.valueVi
                            : item.statusTypeDataPatient.valueEn;
                        
                        return (
                          
                          <tr key={index} onClick={() => this.handleViewPatientDetail(item)} style={{ cursor: 'pointer' }}>
                            <td>{index + 1}</td>
                            <td>{item.patientData.email}</td>
                            <td>{time}</td>
                            <td>{item.patientData.firstName}</td>
                            <td>{gender}</td>
                            <td>{item.patientData.address}</td>
                            <td>{statusCheck}</td>
                            <td>
                              {item.statusId && item.statusId === "S1" && (
                                <button
                                  className="btn btn-danger ml-3"
                                  onClick={(e) => { e.stopPropagation(); this.handleBtnCancel(item); }} 
                                >
                                  <FormattedMessage id="admin.manage-patient.cancel" />
                                </button>
                              )}
                              {item.statusId && item.statusId === "S2" && (
                                <button
                                  className="btn btn-info ml-3"
                                  onClick={(e) => { e.stopPropagation(); this.handleBtnConfirm(item); }} 
                                >
                                  <FormattedMessage id="admin.manage-patient.confirm" />
                                </button>
                              )}
                              {item.statusId && item.statusId === "S3" && (
                                <div className="row-text">
                                  <FormattedMessage id="admin.manage-patient.done" />
                                </div>
                              )}
                              {item.statusId && item.statusId === "S4" && (
                                <div className="row-text">
                                  <FormattedMessage id="admin.manage-patient.check-cancel" />
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center' }}>
                            <FormattedMessage id="admin.manage-patient.no-data" defaultMessage="Không có dữ liệu bệnh nhân." />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <RemedyModal
            isOpenRemedyModal={isOpenRemedyModal}
            dataModal={dataModal}
            closeRemedyModal={this.closeRemedyModal}
            sendRemedy={this.sendRemedy}
          />
          {/* <-- Tích hợp PatientDetailModal mới */}
          <PatientDetailModal
            isOpen={isOpenPatientDetailModal}
            closePatientDetailModal={this.closePatientDetailModal}
            patientInfo={selectedPatientData}
          />
        </LoadingOverlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
