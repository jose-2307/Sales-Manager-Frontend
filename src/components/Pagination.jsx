import "./styles/Pagination.css";

const Pagination = ({ totalElements, elementsPerPage, setCurrentPage, currentPage }) => {
    const pages = [];

    for (let i = 1; i <= Math.ceil(totalElements/elementsPerPage); i ++) { //aproxima
        pages.push(i);
    }

    return (
        <div className="pagination">
            {
             pages.map((p, i) => {
                return <button key={i} onClick={() => setCurrentPage(p)} className={p == currentPage ? "active" : ""}>{p}</button>
             })   
            }
        </div>
    )
}
export default Pagination;