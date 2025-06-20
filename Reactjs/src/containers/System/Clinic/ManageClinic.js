import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageClinic.scss'
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import { createNewClinicService } from '../../../services/userService'
import {toast} from 'react-toastify'


const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            address: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
        }
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionMarkdown: text,
            descriptionHTML: html
        })
    }

    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state }
        stateCopy[id] = event.target.value
        this.setState({
            ...stateCopy
        })
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file)
            this.setState({
                imageBase64: base64,
            })
        }
        
    }

    handleSaveNewClinic = async () => {
        let res = await createNewClinicService(this.state)
        if (res && res.errCode === 0) {
            toast.success('Add new clinic succeed!')
            this.setState({
                name: '',
                address: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
            })
        } else {
            toast.error('Add clinic failed!')
        }
    }

    render() {
        let {language} = this.props
        return (
            <div className='manage-clinic-container'>
                <div className='ms-title'>
                    <FormattedMessage id="admin.manage-clinic.title"/>
                </div>
                <div className='add-new-clinic row'>
                    <div className='col-6 form-group'>
                        <label><FormattedMessage id="admin.manage-clinic.name-clinic"/></label>
                        <input className='form-control' type='text' value={this.state.name}
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label><FormattedMessage id="admin.manage-clinic.img-clinic"/></label>
                        <input className='form-control-file' type='file'
                            onChange={(event) => this.handleOnChangeImage(event)}
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label>Địa chỉ phòng khám</label>
                        <input className='form-control' type='text' value={this.state.address}
                            onChange={(event) => this.handleOnChangeInput(event, 'address')}
                        />
                    </div>
                    <div className='col-12'>
                        <MdEditor style={{ height: '400px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className='col-12'>
                        <button className='btn btn-primary mt-3 btn-save-clinic'
                        onClick={() => this.handleSaveNewClinic()}
                        ><FormattedMessage id="admin.manage-clinic.save"/>
                        </button>
                    </div>
                </div>  
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {    
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
