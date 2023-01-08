import React from 'react';

const Help = props => {
    return (
        <div className='show_help'>
            <p style={{fontWeight: "700"}}>Keyboard Shortcuts</p>
            <table><tbody>
            <tr>
                <td>
                <div style={{display: "flex", flexDirection: "row"}}>
                <div className="key">&larr;</div>&nbsp;<div className="key">&uarr;</div>&nbsp;<div className="key">&rarr;</div>&nbsp;<div className="key">&darr;</div>
                </div>
                </td>
                <td> Move the Selected Region by 1px</td>
            </tr>
            <tr>
                <td>
                <div style={{display: "flex", flexDirection: "row"}}>
                <div className='key'>Shift</div><div> + </div><div className="key">&larr;</div>&nbsp;<div className="key">&uarr;</div>&nbsp;<div className="key">&rarr;</div>&nbsp;<div className="key">&darr;</div>
                </div>
                </td>
                <td> Move the Selected Region by 10px</td>
            </tr>
            <tr>
                <td><div className='key'>Enter</div></td><td> Finish Drawing</td>
            </tr>
            <tr>
                <td><div className='key'>Space</div></td><td> Toggle Preview</td>
            </tr>
            <tr>
                <td><div className='key'>Delete</div></td><td> Delete the Selected Region</td>
            </tr>
            </tbody></table>
        </div>
    );
};


export default Help;