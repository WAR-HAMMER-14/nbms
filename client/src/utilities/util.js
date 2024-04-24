function FilterOutputText (encodedText)
{
    const textarea = document.createElement('textarea');
    textarea.innerHTML = encodedText;
    
    return textarea.value;
}

export default FilterOutputText;