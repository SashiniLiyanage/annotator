import React from 'react';

const RegionTable = ({showPoints}) => {
    return (
        <table className='show_regions'>
              <tbody>
                <tr>
                  <th>ID</th>
                  <th>Region</th>
                  <th>Bounding Box</th>
                  <th>Coordinates</th>
                </tr>
                {showPoints}
              </tbody>
        </table>
    );
};

export default RegionTable;