import React from 'react'

const Pagination = ({pageCount,currentPage,onPageNav}) => {

    const pages = [];

    for(let i=1;i<=pageCount;i++)
    {
        if(i==currentPage)
        {
            pages.push(<li key={i} onClick={()=>onPageNav(i)} className="action">{i}</li>);
        }
        else
        {
            pages.push(<li key={i} onClick={()=>onPageNav(i)}>{i}</li>);
        }
    }

  return (
    <>
        <div className="pagination">
            <ul>
                {currentPage-1 >= 1 ? <li onClick={()=>onPageNav(currentPage-1 < 1 ? 1 : currentPage-1)}>Previous</li> : ''}
                {pages}
                {currentPage+1 <= pageCount ? <li onClick={()=>onPageNav(currentPage+1 > pageCount ? pageCount : currentPage+1)}>Next</li>: ''}
            </ul>
        </div>
    </>
  )
}

export default Pagination