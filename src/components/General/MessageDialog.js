const MessageDialog = (props) => {
    return (
        <>
            <div>
                <button type='button' id='btnOpenAlert' style={{ visibility: 'hidden' }} data-bs-toggle='modal' data-bs-target='#messageDialog' />
            </div>
            <div className="modal" tabIndex="-1" id="messageDialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className='d-flex'>
                                <i className='fa-light fa-bell fw-bold fs-2 mt-1 formIcon'></i>
                                <h5 className="modal-title fw-bold ms-2">{props?.msg?.title}</h5>
                            </div>
                            {/* <button type="button" className="btn" data-bs-dismiss="modal" aria-label="Close">
                            <i className='fa-light fa-xmark fw-bold fs-2 formIcon'></i>
                        </button> */}
                        </div>
                        <div className="modal-body">
                            <p>{props?.msg?.body}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" id='btnMsgDialogOk' className="btn btn-success rounded-pill w-25" data-bs-dismiss="modal">Got it</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default MessageDialog