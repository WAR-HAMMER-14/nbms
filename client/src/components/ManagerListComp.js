import React from 'react'

const ManagerListComp = ({options,selectedManager,onSelectChange}) => {
    const onOptionChangeHandler = (event) => {
        onSelectChange(event.target.value);
    }
    

  return (
    <>
        <label>Building Manager</label>
        <select onChange={onOptionChangeHandler}>
        
        <option>Select Manager</option>
            {options.map((option, index) => {
                return <option key={index} value={option.value} selected={option.value===selectedManager?'selected':''}>
                    {option.label}
                </option>
            })}
        </select>
    
    
    </>
  )
}

export default ManagerListComp