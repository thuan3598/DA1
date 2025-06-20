import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageHandBook.scss'
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import { createNewHandBookService } from '../../../services/userService'
import {toast} from 'react-toastify'

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageHandBook extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
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

    handleSaveNewHandBook = async () => {
        let res = await createNewHandBookService(this.state)
        if (res && res.errCode === 0) {
            toast.success('Add new handbook succeed!')
            this.setState({
                name: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
            })
        } else {
            toast.error('Add handbook failed!')
        }
    }

    render() {
        let {language} = this.props
        return (
            <div className='manage-handbook-container'>
                <div className='ms-title'>
                    <FormattedMessage id="admin.manage-handbook.title"/>
                </div>
                <div className='add-new-handbook row'>
                    <div className='col-6 form-group'>
                        <label><FormattedMessage id="admin.manage-handbook.name-handbook"/></label>
                        <input className='form-control' type='text' value={this.state.name}
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label><FormattedMessage id="admin.manage-handbook.img-handbook"/></label>
                        <input className='form-control-file' type='file'
                            onChange={(event) => this.handleOnChangeImage(event)}
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
                        <button className='btn btn-primary mt-3 btn-save-handbook'
                        onClick={() => this.handleSaveNewHandBook()}
                        ><FormattedMessage id="admin.manage-handbook.save"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageHandBook);
