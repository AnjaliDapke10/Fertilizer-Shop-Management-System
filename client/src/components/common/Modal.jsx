const Modal = ({ title, onClose, children, footer }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">

        {/* HEADER */}
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>

        {/* BODY (SCROLLABLE) */}
        <div className="modal-body">
          {children}
        </div>

        {/* FOOTER (FIXED) */}
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}

      </div>
    </div>
  );
};

export default Modal;
