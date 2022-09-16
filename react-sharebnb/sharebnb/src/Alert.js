/** Function for rendering an alert message
 * Props:
 * - message: The message to be shown
 * - type: the type of alert message (success, danger, etc)
 */

function Alert({ message, type }) {
    return (
        <div className={`mb-3 alert alert-${type}`} role="alert">{message}
        </div>
    )
}

export default Alert;