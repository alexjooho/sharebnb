/** Function for rendering a not found page */

function NotFound({ message = '' }) {
    document.title = "ShareBnB Page Not Found"
    return (
        <>
            <h1>404 Error: Page not found</h1>
            <p>{message}</p>
        </>
    )
}

export default NotFound;