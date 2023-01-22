import React from 'react';
import CopyToClipboard from './CopyToClipBoard';

const RegionTable = ({showPoints}) => {
    return (
        <table className='show_regions'>
              <tbody>
                <tr>
                  <th>ID</th>
                  <th>Region</th>
                  <th>Bounding Box</th>
                  <th>Coordinates (for COCO format)</th>
                </tr>
                {showPoints.coordinates.map((points, index) =>
                    <tr  key={index}>
                      <td>{index+1}</td>
                      <td><div className='coordinates-wrapper' >{showPoints.type[index]}<CopyToClipboard text={showPoints.type[index]}/></div></td>
                      <td><div className='coordinates-wrapper' >[{showPoints.bbox[index]}]<CopyToClipboard text={showPoints.bbox[index]}/></div></td>
                      <td><div className='coordinates-wrapper' ><p className='coordinates'>[{points}]</p><CopyToClipboard text={points}/></div></td>
                    </tr>
                  )}
              </tbody>
        </table>
    );
};

export default RegionTable;